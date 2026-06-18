from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pinesphere Internship ERP"
    API_V1_STR: str = "/api/v1"
    
    # Security (The Master Keys)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"

    #Database
    DATABASE_URL: str
    
    # How long before the VIP pass expires
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    class Config:
        # This tells the code to look for a hidden file named '.env'
        env_file = ".env"

# We create one copy of these settings to use everywhere in our kitchen
settings = Settings()