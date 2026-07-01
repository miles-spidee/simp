from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
if "?ssl=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]

engine = create_engine(DATABASE_URL)
with engine.connect() as conn:
    res = conn.execute(text("SELECT pid, state, query FROM pg_stat_activity WHERE state != 'idle';"))
    for row in res.fetchall():
        print(f"PID: {row[0]}, State: {row[1]}, Query: {row[2]}")

