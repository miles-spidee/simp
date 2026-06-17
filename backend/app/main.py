from fastapi import FastAPI

# App initialization
app = FastAPI()

# # Example Route
# @app.get("/check") # We can use app.post() also for POST requests
# def health_check():
#     return {"status": "ok !!"}