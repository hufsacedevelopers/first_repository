import json
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        enable_decoding=False,
    )

    app_env: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]
    odcloud_base_url: str = "https://api.odcloud.kr/api"
    odcloud_api_key: str = ""
    data_go_base_url: str = "https://apis.data.go.kr/B552583/comp"
    data_go_api_key: str = ""
    data_go_job_base_url: str = "https://apis.data.go.kr/B552583/job"

    # 경기도 Open API (장애인활동지원기관현황)
    gg_api_key: str = ""
    gg_api_base_url: str = "https://openapi.gg.go.kr/DisaActvSuprtInstList"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        # Railway 환경변수에서 문자열 한 줄로 넣어도 동작하도록 유연하게 파싱한다.
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip()]
        if isinstance(value, str):
            raw = value.strip()
            if not raw:
                return ["http://localhost:3000"]
            if raw.startswith("["):
                try:
                    parsed = json.loads(raw)
                    if isinstance(parsed, list):
                        return [str(v).strip() for v in parsed if str(v).strip()]
                except json.JSONDecodeError:
                    pass
            return [item.strip() for item in raw.split(",") if item.strip()]
        return ["http://localhost:3000"]


settings = Settings()
