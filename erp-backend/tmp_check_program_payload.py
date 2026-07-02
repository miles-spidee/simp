from app.modules.program.schemas import ProgramCreate
from app.models.academic.program import Program

payload = ProgramCreate(
    program_name='sfgh',
    program_code='sdfghj',
    internship_type_id='',
    program_description='',
    duration_weeks=8,
    certificate_available=True,
    status='DRAFT'
)

print(payload.model_dump(exclude_none=True))
print({k: v for k, v in payload.model_dump(exclude_none=True).items() if hasattr(Program, k)})
