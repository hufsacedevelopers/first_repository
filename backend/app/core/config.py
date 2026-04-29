from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]
    odcloud_base_url: str = "https://api.odcloud.kr/api"
    odcloud_api_key: str = ""
    data_go_base_url: str = "https://apis.data.go.kr/B552583/comp"
    data_go_api_key: str = ""
    data_go_job_base_url: str = "https://apis.data.go.kr/B552583/job"


settings = Settings()
