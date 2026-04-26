from pydantic import BaseModel


class Company(BaseModel):
    companyName: str
    location: str
    disabledEmploymentRate: float
    retentionRate: float
    jobDiversity: int
    friendlinessScore: int
