import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def main():
    db_url = os.getenv("DATABASE_URL")
    # Expected format: postgresql+asyncpg://postgres:simpdb123@simp-db-instance.../simp_db?ssl=require
    # Let's extract the connection parts
    # or simpler, replace 'postgresql+asyncpg' with 'postgres'
    if db_url.startswith("postgresql+asyncpg://"):
        db_url = db_url.replace("postgresql+asyncpg://", "postgres://")
    
    db_url = db_url.replace("ssl=require", "sslmode=require")
    
    print(f"Connecting to {db_url}")
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE intern_opportunities ADD COLUMN fee NUMERIC(10, 2);")
        print("Added fee column successfully")
    except Exception as e:
        print(f"Error adding column (maybe it already exists?): {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
