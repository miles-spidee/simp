import requests
import uuid

def test_system():
    print("Testing System APIs...")
    # 1. Login
    resp = requests.post("http://localhost:8000/api/v1/auth/login", json={
        "username": "admin@pinesphere.com",
        "password": "ChangeMe@123"
    })
    
    if resp.status_code != 200:
        print("Login Failed:", resp.text)
        return
        
    data = resp.json()
    if not data.get("success"):
        print("Login payload failed:", data)
        return
        
    token = data["data"]["access_token"]
    print("Login successful! Token acquired.")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Test RBAC protected route
    resp = requests.get("http://localhost:8000/api/v1/organization/colleges", headers=headers)
    print("GET /colleges with token:", resp.status_code)
    
    resp_no_token = requests.get("http://localhost:8000/api/v1/organization/colleges")
    print("GET /colleges without token:", resp_no_token.status_code)
    
    # 3. Create College
    print("Creating College...")
    rand_code = f"TU-{str(uuid.uuid4())[:4]}"
    college = {
        "college_name": f"Test University {rand_code}",
        "college_code": rand_code,
        "status": "Active"
    }
    resp = requests.post("http://localhost:8000/api/v1/organization/colleges", json=college, headers=headers)
    print("POST /colleges:", resp.status_code, resp.text)

if __name__ == "__main__":
    test_system()
