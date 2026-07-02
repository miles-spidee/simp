from uuid import UUID

from app.modules.program.schemas import ProgramCreate
from app.modules.application.schemas import ApplicationCreate


def test_program_create_accepts_frontend_payload_and_normalizes_fields():
    payload = ProgramCreate(
        program_name="Software Engineering",
        program_code="SE-101",
        program_description="Intro to engineering",
        duration_weeks=12,
        certificate_available=True,
        internship_type_id="degree",
        status="DRAFT",
    )

    assert payload.name == "Software Engineering"
    assert payload.code == "SE-101"
    assert payload.description == "Intro to engineering"
    assert payload.duration_months == 3
    assert payload.program_type == "degree"
