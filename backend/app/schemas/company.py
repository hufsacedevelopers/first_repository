from pydantic import BaseModel


class Company(BaseModel):
    companyName: str
    location: str
    disabledEmploymentRate: float
    retentionRate: float
    jobDiversity: int
    friendlinessScore: int
    # 생활 접근성 관련 (경기도 장애인활동지원기관 데이터 기반, GG_API_KEY 설정 시 채워짐)
    accessibilityScore: float | None = None  # 0~1 정규화 점수
    compositeScore: int | None = None        # 종합 점수 0~100 (friendlinessScore*0.7 + accessibility*0.3)


class CompanyListResponse(BaseModel):
    source: str
    syncedAt: str
    data: list[Company]
