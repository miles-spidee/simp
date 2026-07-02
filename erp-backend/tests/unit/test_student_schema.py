from app.modules.student.router import StudentCreate

def test_student_create_accepts_application_and_program_payload():
    payload = {
        "application_id": "app-1",
        "program_id": "prog-1"
    }
    schema = StudentCreate(**payload)
    assert schema.application_id == "app-1"
    assert schema.program_id == "prog-1"
    assert schema.first_name is None
    assert schema.last_name is None
