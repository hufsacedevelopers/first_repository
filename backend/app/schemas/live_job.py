from pydantic import BaseModel


class LiveJob(BaseModel):
    recruitmentPeriod: str = ""
    businessName: str = ""
    contactNumber: str = ""
    companyAddress: str = ""
    employmentType: str = ""
    entryType: str = ""
    jobName: str = ""
    applicationDate: str = ""
    registeredAt: str = ""
    agencyName: str = ""
    requiredCareer: str = ""
    requiredEducation: str = ""
    salaryType: str = ""
    salary: str = ""


class LiveJobWithEnv(LiveJob):
    envBothHands: str = ""
    envEyesight: str = ""
    envHandwork: str = ""
    envLiftPower: str = ""
    envLstnTalk: str = ""
    envStndWalk: str = ""


class LiveJobResponse(BaseModel):
    pageNo: int
    numOfRows: int
    totalCount: int
    data: list[LiveJob]


class LiveJobWithEnvResponse(BaseModel):
    pageNo: int
    numOfRows: int
    totalCount: int
    data: list[LiveJobWithEnv]
