from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    mongo_url: str = "mongodb://admin:neurolab_secret@localhost:27017"
    mongo_db: str = "neurolab"
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:80",
        "http://localhost",
    ]
    env: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
