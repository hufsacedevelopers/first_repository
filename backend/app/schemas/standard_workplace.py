from pydantic import BaseModel


class StandardWorkplace(BaseModel):
    certificationNumber: str = ""
    certificationDate: str = ""
    businessRegistrationNumber: str = ""
    workplaceName: str = ""
    address: str = ""
    phoneNumber: str = ""


class StandardWorkplaceResponse(BaseModel):
    pageNo: int
    numOfRows: int
    totalCount: int
    data: list[StandardWorkplace]
