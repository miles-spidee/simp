import asyncio
from app.core.database import AsyncSessionLocal
from app.modules.student.router import get_student_list
import json

async def main():
    async with AsyncSessionLocal() as db:
        try:
            res = await get_student_list(db)
            data = json.loads(res.body)
            print("Success:", len(data.get("data", [])))
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
