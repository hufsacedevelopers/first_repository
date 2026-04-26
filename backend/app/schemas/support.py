from pydantic import BaseModel


class Support(BaseModel):
    supportName: str
    target: str
    amount: str
    description: str
