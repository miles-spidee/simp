import asyncio
from sqlalchemy import select, func
from app.models.profiles.student_profile import StudentProfile
from app.models.academic.program import Program
from app.models.academic.batch import Batch
from sqlalchemy.orm import class_mapper

def get_models_from_stmt(stmt):
    models = set()
    for entity in stmt.get_final_froms():
        # Iterate over all mappers to find which ones map to this table
        from app.models.core.base import Base
        for mapper in Base.registry.mappers:
            if getattr(mapper, 'local_table', None) is entity:
                models.add(mapper.class_)
    return models

stmt = select(func.count(StudentProfile.id))
print("StudentProfile models:", get_models_from_stmt(stmt))

stmt2 = select(Program).join(Batch)
print("Program models:", get_models_from_stmt(stmt2))
