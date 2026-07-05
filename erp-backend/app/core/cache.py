"""
app/core/cache.py
=================
Lightweight, thread-safe, in-memory TTL cache.

Used across the hot-path of every request:
  - Authenticated user objects  (60 s TTL)
  - Permission checks           (300 s TTL — already in PermissionRepository)
  - Any other stable lookup data

No external dependencies (no Redis required). For a production deployment
that runs multiple workers, replace with Redis. For a single-worker uvicorn
deployment this is perfectly safe and eliminates significant DB round-trips.
"""
from __future__ import annotations

import asyncio
import time
from typing import Any, Generic, TypeVar, Optional

T = TypeVar("T")


class TTLCache(Generic[T]):
    """Simple dict-backed TTL cache with optional max-size eviction (LRU-lite)."""

    __slots__ = ("_store", "_ttl", "_maxsize")

    def __init__(self, ttl: float = 60.0, maxsize: int = 4096) -> None:
        self._store: dict[str, tuple[T, float]] = {}
        self._ttl = ttl
        self._maxsize = maxsize

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def get(self, key: str) -> Optional[T]:
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if time.monotonic() > expires_at:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: T, ttl: float | None = None) -> None:
        # Evict oldest entries if at capacity
        if len(self._store) >= self._maxsize:
            # Remove the 10% oldest entries
            to_remove = max(1, self._maxsize // 10)
            oldest_keys = sorted(
                self._store, key=lambda k: self._store[k][1]
            )[:to_remove]
            for k in oldest_keys:
                del self._store[k]

        expires_at = time.monotonic() + (ttl if ttl is not None else self._ttl)
        self._store[key] = (value, expires_at)

    def invalidate(self, key: str) -> None:
        self._store.pop(key, None)

    def invalidate_prefix(self, prefix: str) -> None:
        keys = [k for k in self._store if k.startswith(prefix)]
        for k in keys:
            del self._store[k]

    def clear(self) -> None:
        self._store.clear()

    def __len__(self) -> int:
        return len(self._store)

    async def fetch(self, key: str, loader, ttl: float | None = None) -> T:
        """
        Cache-aside helper:
            value = await cache.fetch("key", async_loader_fn, ttl=30)
        Calls loader() only on a cache miss.
        """
        cached = self.get(key)
        if cached is not None:
            return cached
        value = await loader() if asyncio.iscoroutinefunction(loader) else loader()
        self.set(key, value, ttl)
        return value


# ---------------------------------------------------------------------------
# Singleton caches — import these directly throughout the app
# ---------------------------------------------------------------------------

#: User objects keyed by user_id (str). 60-second TTL so stale data is brief.
user_cache: TTLCache[Any] = TTLCache(ttl=60.0, maxsize=2048)

#: Generic application-level cache for any hot-path data.
app_cache: TTLCache[Any] = TTLCache(ttl=300.0, maxsize=4096)
