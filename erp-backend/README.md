# Pinesphere Internship ERP — Backend

## Stack
- FastAPI + Python 3.11
- PostgreSQL 16 (AsyncPG)
- SQLAlchemy 2.0 (async)
- Alembic (migrations)

## Architecture Rule
Router → Service → Repository → Database
Never skip a layer. Never cross module boundaries directly.

## Setup
```bash
cp .env.example .env
# Fill in DATABASE_URL with DB team's IP
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Module Development Sequence
1. identity → 2. employee → 3. organization → 4. program
5. opportunity → 6. application → 7. student → 8. batch
9. allocation → 10. mentor → 11. lms → 12. task
13. assessment → 14. submission → 15. attendance → 16. performance
17. coordinator → 18. super_admin → 19. files → 20. dashboard
