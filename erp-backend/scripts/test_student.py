import asyncio
from app.core.database import AsyncSessionLocal
from app.modules.student.router import get_student_list
import traceback

async def test():
    async with AsyncSessionLocal() as db:
        try:
            res = await get_student_list(db)
            print("Response:", res)
        except Exception as e:
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
