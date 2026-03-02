from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Server
    port: int = 5000
    environment: str = "production"

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 10080  # 7 days

    # Frontend
    frontend_url: str

    # Google OAuth
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
