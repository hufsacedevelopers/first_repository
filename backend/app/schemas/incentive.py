from pydantic import BaseModel


class IncentiveCompanyStat(BaseModel):
    year: int
    region: str
    industry: str
    businessCount: int


class IncentiveCompanyStatResponse(BaseModel):
    page: int
    perPage: int
    totalCount: int
    currentCount: int
    data: list[IncentiveCompanyStat]
