from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Server
    port: int = 5000
    environment: str = "development"
    
    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    
    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 10080  # 7 days
    
    # Frontend
    frontend_url: str = "http://localhost:5173"
    
    # Google OAuth
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str = "http://localhost:5000/api/auth/google/callback"
    
    # Twitter OAuth
    twitter_client_id: str
    twitter_client_secret: str
    twitter_redirect_uri: str = "http://localhost:5000/api/auth/twitter/callback"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
