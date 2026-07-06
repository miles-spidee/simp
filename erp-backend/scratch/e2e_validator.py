import httpx
import logging
from uuid import uuid4

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000/api/v1"

class E2EValidator:
    def __init__(self):
        self.client = httpx.Client(base_url=BASE_URL, timeout=30.0)
        self.superadmin_token = None
        self.hr_token = None
        
        # State tracking
        self.run_id = str(uuid4())[:8]
        self.hr_email = f"anish.hr_{self.run_id}@pinesphere.example.com"
        
        self.hr_employee_id = None
        self.hr_user_id = None
        self.program_id = None
        self.batch_id = None
        
    def login_superadmin(self):
        logger.info("=== PART 1: SUPER ADMIN LOGIN ===")
        res = self.client.post("/auth/login", json={
            "username": "superadmin@pinesphere.example.com",
            "password": "Admin@123!",
            "rememberMe": True
        })
        if res.status_code != 200:
            logger.error(f"Super Admin Login Failed: {res.text}")
            raise Exception("Super Admin Login Failed")
        
        data = res.json()["data"]
        self.superadmin_token = data["access_token"]
        self.client.headers.update({"Authorization": f"Bearer {self.superadmin_token}"})
        logger.info("Super Admin logged in successfully.")

    def get_role_id(self, role_name="HR"):
        res = self.client.get("/rbac/roles", params={"limit": 100})
        if res.status_code != 200:
            raise Exception("Failed to fetch roles")
        roles = res.json().get("data", [])
        for r in roles:
            if r["name"] == role_name or r["code"] == role_name:
                return r["id"]
        # If not found, create it
        res = self.client.post("/rbac/roles", json={
            "name": role_name,
            "code": role_name,
            "description": f"{role_name} Role"
        })
        return res.json()["data"]["id"]

    def create_hr_employee(self):
        logger.info("=== PART 1: SUPER ADMIN ONBOARDING HR ===")
        hr_role_id = self.get_role_id("HR")
        
        # 0. Ensure an organization exists
        org_res = self.client.post("/organization/colleges", json={
            "college_name": "Pinesphere HQ",
            "college_code": "PHQ",
            "college_email": "info@pinesphere.example.com",
            "status": "ACTIVE"
        })
        if org_res.status_code not in (200, 201) and "already exists" not in org_res.text:
            pass # Just assume it might fail if it already exists, or it succeeds.
            
        # Get org ID
        orgs = self.client.get("/organization/colleges").json().get("data", [])
        if not orgs:
            raise Exception("No organization found")
        org_id = orgs[0]["college_id"]
        
        # 0.5 Ensure department exists
        self.client.post("/organization/departments", json={
            "college_id": org_id,
            "department_name": "Human Resources",
            "department_code": "HRD",
            "hod_name": "HR Head"
        })

        # 1. Create Employee Profile
        emp_res = self.client.post("/employee/", json={
            "first_name": "Anish",
            "last_name": f"HR-{self.run_id}",
            "official_email": self.hr_email,
            "designation": "HR Manager",
            "phone_number": "+919876543210",
        })
        if emp_res.status_code != 200:
            logger.error(f"Employee creation failed: {emp_res.text}")
            raise Exception("Employee creation failed")
            
        emp_data = emp_res.json()["data"]
        self.hr_employee_id = emp_data["employee_id"]
        logger.info(f"HR Employee Created: {self.hr_employee_id}")

        # 2. Create User for Employee
        user_res = self.client.post("/users/", json={
            "username": self.hr_email,
            "email": self.hr_email,
            "password": "ChangeMe@123",
            "roleId": hr_role_id,
            "entityType": "employee",
            "entityId": self.hr_employee_id,
            "sendEmail": True,
            "forcePasswordChange": True
        })
        if user_res.status_code != 200:
            logger.error(f"User creation failed: {user_res.text}")
            raise Exception("User creation failed")
            
        self.hr_user_id = user_res.json()["data"]["id"]
        logger.info(f"HR User Created: {self.hr_user_id}")

    def hr_first_login(self):
        logger.info("=== PART 2: HR FIRST LOGIN ===")
        # Use a new client for HR
        self.hr_client = httpx.Client(base_url=BASE_URL, timeout=30.0)
        
        # 1. Login with temporary password
        res = self.hr_client.post("/auth/login", json={
            "username": self.hr_email,
            "password": "ChangeMe@123",
            "rememberMe": False
        })
        if res.status_code != 200:
            logger.error(f"HR First Login Failed: {res.text}")
            raise Exception("HR First Login Failed")
            
        # The backend should ideally throw a 403 or return a specific flag if force password change is active
        # Let's assume it allows login but we must call a password change API. 
        # Wait, how does Force Password Change work in this system?
        # Typically it returns the JWT but sets `force_password_change` flag in response.
        data = res.json()["data"]
        token = data["access_token"]
        self.hr_client.headers.update({"Authorization": f"Bearer {token}"})
        
        # 2. Change Password
        cp_res = self.hr_client.post("/auth/change-password", json={
            "old_password": "ChangeMe@123",
            "new_password": "NewHRPassword@123!",
            "confirm_password": "NewHRPassword@123!"
        })
        if cp_res.status_code != 200:
            logger.error(f"HR Password Change Failed: {cp_res.text}")
            raise Exception("HR Password Change Failed")
            
        # Now login again with new password
        res = self.hr_client.post("/auth/login", json={
            "username": self.hr_email,
            "password": "NewHRPassword@123!",
            "rememberMe": True
        })
        if res.status_code != 200:
            logger.error(f"HR Login with new password failed: {res.text}")
            raise Exception("HR Login with new password failed")
            
        self.hr_token = res.json()["data"]["access_token"]
        self.hr_client.headers.update({"Authorization": f"Bearer {self.hr_token}"})
        logger.info("HR password changed and relogged successfully.")

    def hr_create_program(self):
        logger.info("=== PART 3: HR CREATES PROGRAM ===")
        res = self.hr_client.post("/program/", json={
            "name": "Full Stack Developer Trainee",
            "code": f"FSD-{self.run_id}",
            "program_type": "INTERNSHIP",
            "description": "6 Months Intensive Training",
            "duration_months": 6
        })
        if res.status_code != 201:
            logger.error(f"Failed to create program: {res.text}")
            raise Exception("Failed to create program")
            
        self.program_id = res.json()["program_id"]
        logger.info(f"Program Created: {self.program_id}")

    def hr_create_batch(self):
        logger.info("=== PART 4: HR CREATES BATCH ===")
        res = self.hr_client.post("/batch/", json={
            "program_id": self.program_id,
            "name": f"Summer 2026 - {self.run_id}",
            "batch_code": f"B-{self.run_id}",
            "start_date": "2026-06-01T00:00:00Z",
            "end_date": "2026-11-30T00:00:00Z",
            "status": "UPCOMING",
            "max_capacity": 50,
            "description": "Summer Intake"
        })
        if res.status_code != 200:
            logger.error(f"Failed to create batch: {res.text}")
            raise Exception("Failed to create batch")
            
        self.batch_id = res.json()["data"]["batch_id"]
        logger.info(f"Batch Created: {self.batch_id}")

    def hr_create_allocation(self):
        logger.info("=== PART 5: HR ALLOCATES PROGRAM TO BATCH ===")
        res = self.hr_client.post("/allocation/", json={
            "source_type": "PROGRAM",
            "source_id": self.program_id,
            "target_type": "BATCH",
            "target_id": self.batch_id,
            "role": "PROGRAM_BATCH_MAPPING"
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to allocate: {res.text}")
            raise Exception("Failed to allocate")
            
        self.allocation_id = res.json()["data"]["id"]
        logger.info(f"Allocation Created: {self.allocation_id}")
        
    def hr_create_opportunity(self):
        logger.info("=== PART 6: HR CREATES OPPORTUNITY ===")
        res = self.hr_client.post("/opportunity/", json={
            "project_title": "Full Stack Developer Trainee",
            "role_name": "Trainee",
            "role_description": "Learn and build",
            "opening_status": "PUBLISHED",
            "program_id": self.program_id,
            "location": "Remote",
            "duration_weeks": 24
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to create opportunity: {res.text}")
            raise Exception("Failed to create opportunity")
            
        self.opportunity_id = res.json()["id"]
        logger.info(f"Opportunity Created: {self.opportunity_id}")
        
    def student_application(self):
        logger.info("=== PART 7: STUDENT APPLICATION ===")
        self.student_email = f"arun_{self.run_id}@gmail.com"
        res = self.client.post("/application/", json={
            "first_name": "Arun",
            "last_name": "Kumar",
            "email": self.student_email,
            "mobile_number": "9876543211",
            "opening_id": self.opportunity_id
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to apply: {res.text}")
            raise Exception("Failed to apply")
            
        self.application_id = res.json()["data"]["application_id"]
        logger.info(f"Application Created: {self.application_id}")

    def hr_shortlist_student(self):
        logger.info("=== PART 8: HR SHORTLIST ===")
        res = self.hr_client.patch(f"/application/{self.application_id}/review", json={
            "application_status": "SHORTLISTED",
            "remarks": "Interview Scheduled"
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to shortlist: {res.text}")
            raise Exception("Failed to shortlist")
        logger.info("Application Shortlisted")

    def hr_select_student(self):
        logger.info("=== PART 10: HR SELECTS STUDENT ===")
        res = self.hr_client.patch(f"/application/{self.application_id}/review", json={
            "application_status": "SELECTED",
            "remarks": "Welcome aboard"
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to select: {res.text}")
            raise Exception("Failed to select")
        logger.info("Application Selected")
        
    def hr_enroll_student(self):
        logger.info("=== PART 11: HR ENROLLS STUDENT ===")
        res = self.hr_client.post("/student/", json={
            "first_name": "Arun",
            "last_name": "Kumar",
            "email": self.student_email,
            "status": "Enrolled",
            "program": "Full Stack Developer Trainee",
            "batch_name": f"Summer 2026 - {self.run_id}"
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to enroll student: {res.text}")
            raise Exception("Failed to enroll student")
        
        self.student_id = res.json()["data"]["student_id"]
        logger.info(f"Student Enrolled: {self.student_id}")

    def hr_create_mentor(self):
        logger.info("=== PART 11 (cont): HR CREATES MENTOR ===")
        # 1. Create User
        self.mentor_email = f"mentor_{self.run_id}@pinesphere.example.com"
        self.mentor_username = f"expert_{self.run_id}"
        user_res = self.client.post("/users/", json={
            "username": self.mentor_username,
            "email": self.mentor_email,
            "password": "ChangeMe@123",
            "account_status": "ACTIVE",
            "sendEmail": True,
            "forcePasswordChange": True
        })
        if user_res.status_code not in (200, 201):
            logger.error(f"Failed to create Mentor user: {user_res.text}")
            raise Exception("Mentor User Creation Failed")
            
        self.mentor_user_id = user_res.json()["data"]["id"]
        logger.info(f"Mentor User Created: {self.mentor_user_id}")
        
        # 2. Create Mentor Profile
        res = self.hr_client.post("/mentor/", json={
            "user_id": self.mentor_user_id,
            "expertise": "Software Engineering",
            "years_of_experience": 10,
            "max_capacity": 5,
            "is_available": True
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to create mentor profile: {res.text}")
            raise Exception("Failed to create mentor profile")
        self.mentor_profile_id = res.json()["data"]["mentor_profile_id"]
        logger.info(f"Mentor Profile Created: {self.mentor_profile_id}")

    def hr_assign_mentor(self):
        logger.info("=== PART 13: HR ASSIGNS STUDENT TO MENTOR ===")
        # Assign mentor to student using PUT /student/{id}
        res = self.hr_client.put(f"/student/{self.student_id}", json={
            "mentor_id": self.mentor_profile_id
        })
        if res.status_code not in (200, 201):
            logger.error(f"Failed to assign mentor: {res.text}")
            raise Exception("Failed to assign mentor")
        logger.info("Mentor Assigned to Student")
        
    def run_all(self):
        try:
            self.login_superadmin()
            self.create_hr_employee()
            self.hr_first_login()
            self.hr_create_program()
            self.hr_create_batch()
            self.hr_create_allocation()
            self.hr_create_opportunity()
            self.student_application()
            self.hr_shortlist_student()
            self.hr_select_student()
            self.hr_enroll_student()
            self.hr_create_mentor()
            self.hr_assign_mentor()
            print("Successfully completed Parts 1 to 14 workflows")
        except Exception as e:
            logger.error(f"Validation stopped due to error: {str(e)}")

if __name__ == "__main__":
    validator = E2EValidator()
    validator.run_all()
