import asyncio
from app.services.email_service import email_service

async def main():
    try:
        res = await email_service.send_email(
            "anishvellingiri@gmail.com",
            "Test Email from ERP",
            "<h1>Hello Anish</h1><p>This is a test email.</p>"
        )
        print("Result:", res)
    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    asyncio.run(main())
