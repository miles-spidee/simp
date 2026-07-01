from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import urlencode

import httpx
from fastapi import HTTPException
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.system.verification import VerificationRecord


@dataclass(frozen=True)
class DigiLockerVerificationResult:
    student_profile_id: str
    first_name: str | None
    last_name: str | None
    mobile_number: str | None
    date_of_birth: str | None
    gender: str | None
    city: str | None
    state: str | None
    aadhaar_verified: bool
    aadhaar_number: str | None
    verification_date: datetime


class DigiLockerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def build_authorization_url(self, *, user_id: str, student_profile_id: str, nonce: str | None = None) -> dict[str, str]:
        self._require_configured(["DIGILOCKER_AUTH_BASE_URL", "DIGILOCKER_CLIENT_ID", "DIGILOCKER_REDIRECT_URI"])
        state = self._sign_state(user_id=user_id, student_profile_id=student_profile_id, nonce=nonce)
        query = {
            "response_type": "code",
            "client_id": settings.DIGILOCKER_CLIENT_ID,
            "redirect_uri": settings.DIGILOCKER_REDIRECT_URI,
            "scope": settings.DIGILOCKER_SCOPE,
            "state": state,
        }
        return {
            "authorization_url": f"{settings.DIGILOCKER_AUTH_BASE_URL}?{urlencode(query)}",
            "state": state,
        }

    async def handle_callback(self, *, code: str | None, state: str | None) -> dict[str, Any]:
        if not code or not state:
            raise HTTPException(status_code=400, detail="Invalid DigiLocker callback")

        state_payload = self._verify_state(state)
        access_token = await self._exchange_code_for_token(code=code)
        aadhaar_payload = await self._fetch_verified_aadhaar_details(access_token)
        record = await self._upsert_verification_record(
            entity_id=state_payload["student_profile_id"],
            entity_type="StudentProfile",
            aadhaar_payload=aadhaar_payload,
        )

        return {
            "student_profile_id": state_payload["student_profile_id"],
            "first_name": aadhaar_payload.get("first_name"),
            "last_name": aadhaar_payload.get("last_name"),
            "mobile_number": aadhaar_payload.get("mobile_number"),
            "date_of_birth": aadhaar_payload.get("date_of_birth"),
            "gender": aadhaar_payload.get("gender"),
            "city": aadhaar_payload.get("city"),
            "state": aadhaar_payload.get("state"),
            "aadhaar_verified": True,
            "aadhaar_number": aadhaar_payload.get("aadhaar_number"),
            "verification_date": record.verification_date.isoformat() if record.verification_date else None,
        }

    async def _exchange_code_for_token(self, *, code: str) -> str:
        self._require_configured(["DIGILOCKER_TOKEN_URL", "DIGILOCKER_CLIENT_ID", "DIGILOCKER_CLIENT_SECRET", "DIGILOCKER_REDIRECT_URI"])
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.DIGILOCKER_REDIRECT_URI,
            "client_id": settings.DIGILOCKER_CLIENT_ID,
            "client_secret": settings.DIGILOCKER_CLIENT_SECRET,
        }
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                settings.DIGILOCKER_TOKEN_URL,
                data=payload,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )

        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail="Failed to exchange DigiLocker authorization code")

        body = response.json()
        access_token = body.get("access_token")
        if not access_token:
            raise HTTPException(status_code=502, detail="DigiLocker token response did not include an access token")
        return access_token

    async def _fetch_verified_aadhaar_details(self, access_token: str) -> dict[str, Any]:
        self._require_configured(["DIGILOCKER_USERINFO_URL"])
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(settings.DIGILOCKER_USERINFO_URL, headers=headers)

        if response.status_code == 401:
            raise HTTPException(status_code=401, detail="DigiLocker access token expired or was rejected")
        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail="DigiLocker verification API failed")

        body = response.json()
        return {
            "first_name": body.get("first_name") or body.get("given_name"),
            "last_name": body.get("last_name") or body.get("family_name"),
            "mobile_number": body.get("mobile_number") or body.get("phone_number"),
            "date_of_birth": body.get("date_of_birth") or body.get("dob"),
            "gender": body.get("gender"),
            "city": body.get("city") or body.get("district"),
            "state": body.get("state"),
            "aadhaar_number": body.get("aadhaar_number") or body.get("aadhaarNumber") or body.get("masked_aadhaar_number"),
        }

    async def _upsert_verification_record(self, *, entity_id: str, entity_type: str, aadhaar_payload: dict[str, Any]) -> VerificationRecord:
        stmt = select(VerificationRecord).where(
            VerificationRecord.entity_id == entity_id,
            VerificationRecord.entity_type == entity_type,
        )
        result = await self.db.execute(stmt)
        record = result.scalars().first()
        verification_date = datetime.now(UTC)

        if record is None:
            record = VerificationRecord(
                entity_id=entity_id,
                entity_type=entity_type,
                aadhaar_verified=True,
                aadhaar_number=aadhaar_payload.get("aadhaar_number"),
                verification_date=verification_date,
                status="VERIFIED",
            )
            self.db.add(record)
        else:
            record.aadhaar_verified = True
            record.aadhaar_number = aadhaar_payload.get("aadhaar_number")
            record.verification_date = verification_date
            record.status = "VERIFIED"

        await self.db.flush()
        return record

    def _sign_state(self, *, user_id: str, student_profile_id: str, nonce: str | None) -> str:
        payload = {
            "user_id": user_id,
            "student_profile_id": student_profile_id,
            "nonce": nonce or datetime.now(UTC).isoformat(),
            "exp": datetime.now(UTC) + timedelta(minutes=10),
            "iat": datetime.now(UTC),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    def _verify_state(self, state: str) -> dict[str, str]:
        try:
            payload = jwt.decode(state, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        except JWTError as exc:
            raise HTTPException(status_code=400, detail="Invalid or expired DigiLocker state") from exc

        user_id = payload.get("user_id")
        student_profile_id = payload.get("student_profile_id")
        if not user_id or not student_profile_id:
            raise HTTPException(status_code=400, detail="Invalid DigiLocker state payload")
        return {"user_id": str(user_id), "student_profile_id": str(student_profile_id)}

    def _require_configured(self, keys: list[str]) -> None:
        missing = [key for key in keys if not getattr(settings, key)]
        if missing:
            raise HTTPException(
                status_code=503,
                detail="DigiLocker is not configured. Complete official partner onboarding and set: " + ", ".join(missing),
            )