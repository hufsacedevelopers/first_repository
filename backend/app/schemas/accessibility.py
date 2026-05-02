from pydantic import BaseModel


class RegionAccessibility(BaseModel):
    sigunNm: str          # 시군명
    institutionCount: int  # 기관 수
    accessScore: float    # 0~1 정규화 점수


class AccessibilityResponse(BaseModel):
    regions: list[RegionAccessibility]  # 기관 수 내림차순 정렬
    maxCount: int           # 점수 산출 기준이 된 최대 기관 수
    totalInstitutions: int  # 경기도 전체 기관 수 합계
