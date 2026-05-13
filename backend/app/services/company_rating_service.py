"""
ChoiceWork 기업 장애 친화도(Company Rating) 산출.

- 0~100점 기업 친화도(friendlinessScore): 공공 구인(근무환경 6축)·고용·복지·표준사업장 등 가중 합산.
- 종합(compositeScore): 기업 친화도 70% + 거주 지역 생활 접근성(경기 활동지원 기관 밀도) 30%.
- 데이터: 한국장애인고용공단 구인/환경·표준사업장, 경기도 Open API(설정 시) 등 공공 출처.
"""

from __future__ import annotations

from typing import Any

# 근무환경 6축 (구인 API env 필드 기준, UI·방법론과 동일 명칭)
WORK_ENV_DIMENSION_LABELS_KO: tuple[str, ...] = (
    "서기",
    "시력",
    "청력",
    "중량물",
    "양손",
    "손 작업",
)

# friendlinessScore 구성 가중치 (합 = 1.0)
WEIGHT_EMPLOYMENT_RATE = 0.20  # 장애인 고용률(추정 정규화)
WEIGHT_RETENTION = 0.14  # 근속·유지(프록시)
WEIGHT_JOB_DIVERSITY = 0.12  # 직무 다양성
WEIGHT_STANDARD_WORKPLACE = 0.14  # 표준사업장 인증
WEIGHT_WORK_ENV_SIX = 0.28  # 공고 근무환경 6축 기반 평균
WEIGHT_WELFARE = 0.12  # 복지·고용형태 다양성 등 프록시


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def compute_job_env_friendliness(job: dict[str, Any]) -> int:
    """
    단일 공고의 근무환경(env) 필드를 0~100 친화 점수로 환산.
    (프론트 mapLiveJobToJob의 computeAccessibilityScore와 동일한 룰)
    """
    score = 60
    sw = str(job.get("envStndWalk", "") or "")
    if "서거나 걷는 일 어려움" in sw:
        score += 15
    elif "일부 서서" in sw:
        score += 8

    lp = str(job.get("envLiftPower", "") or "")
    if "5Kg 이내" in lp:
        score += 8
    elif "5~20Kg" in lp:
        score += 4

    ey = str(job.get("envEyesight", "") or "")
    if "일상적 활동" in ey:
        score += 8
    elif "비교적 큰" in ey:
        score += 4

    lt = str(job.get("envLstnTalk", "") or "")
    if "듣고 말하는 작업 어려움" in lt:
        score += 8
    elif "간단한 듣고" in lt:
        score += 5

    bh = str(job.get("envBothHands", "") or "")
    if "한손" in bh:
        score += 5

    et = str(job.get("entryType", "") or "")
    if "신입" in et or "무관" in et:
        score += 3

    return int(_clamp(float(score), 0.0, 100.0))


def average_work_env_for_company(jobs: list[dict[str, Any]], company_name: str) -> float:
    """해당 사업장명 공고들의 근무환경 친화 점수 평균. 없으면 0."""
    name = company_name.strip()
    if not name:
        return 0.0
    scores: list[int] = []
    for j in jobs:
        if str(j.get("businessName", "")).strip() != name:
            continue
        if not any(
            j.get(k)
            for k in (
                "envStndWalk",
                "envEyesight",
                "envLstnTalk",
                "envLiftPower",
                "envBothHands",
                "envHandwork",
            )
        ):
            continue
        scores.append(compute_job_env_friendliness(j))
    if not scores:
        return 0.0
    return sum(scores) / len(scores)


def welfare_proxy_score(job_count: int, type_count: int) -> int:
    """복지·채용 다양성 등에 대한 단순 프록시 점수."""
    return int(_clamp(48.0 + min(type_count, 5) * 9.0 + min(job_count, 10) * 3.0, 40.0, 100.0))


def employment_rate_norm(rate: float) -> float:
    """고용률(%)을 0~100 스케일로 (상한 약 10% 가정)."""
    return float(_clamp(rate / 10.0 * 100.0, 0.0, 100.0))


def compute_friendliness_and_breakdown(
    *,
    disabled_employment_rate: float,
    retention_rate: float,
    job_diversity: int,
    standard_workplace_certified: bool,
    work_env_avg: float,
    job_count: int,
    type_count: int,
) -> tuple[int, dict[str, float]]:
    """
    기업 친화도 본점(0~100)과 산출 근거(부분 점수·동일 가중치로 재현 가능).
    work_env_avg가 0이면 중립값 62를 사용(공고 env 미매칭 시).
    """
    env_used = work_env_avg if work_env_avg > 0 else 62.0
    employment = employment_rate_norm(disabled_employment_rate)
    retention = float(_clamp(retention_rate, 0.0, 100.0))
    diversity = float(_clamp(float(job_diversity), 0.0, 100.0))
    cert = 100.0 if standard_workplace_certified else 55.0
    welfare = float(welfare_proxy_score(job_count, type_count))

    combined = (
        WEIGHT_EMPLOYMENT_RATE * employment
        + WEIGHT_RETENTION * retention
        + WEIGHT_JOB_DIVERSITY * diversity
        + WEIGHT_STANDARD_WORKPLACE * cert
        + WEIGHT_WORK_ENV_SIX * env_used
        + WEIGHT_WELFARE * welfare
    )
    friendliness = int(_clamp(round(combined), 0.0, 100.0))

    breakdown = {
        "employment": round(employment, 1),
        "retention": round(retention, 1),
        "jobDiversity": round(diversity, 1),
        "standardWorkplace": round(cert, 1),
        "workEnvironmentSixAvg": round(env_used, 1),
        "welfare": round(welfare, 1),
    }
    return friendliness, breakdown


def build_rating_methodology() -> dict[str, Any]:
    """API·프론트에 내려줄 평가 방법론 메타(가중치 공개)."""
    return {
        "version": "1.0",
        "effectiveDate": "2026-05-13",
        "title": "기업별 장애 친화도 정량 평가 및 비교",
        "summary": (
            "장애인 고용률·표준사업장 인증·근속·직무 다양성·복지 프록시와, "
            "한국장애인고용공단 구인 근무환경(서기·시력·청력·중량물·양손·손 작업) 6축을 "
            "공고 단위로 점수화한 뒤 기업별 평균을 반영합니다. "
            "종합 점수는 기업 친화도 70%와 거주 지역 접근성(경기도 장애인활동지원 기관 밀도) 30%로 산출합니다."
        ),
        "workEnvDimensionsKo": list(WORK_ENV_DIMENSION_LABELS_KO),
        "weights": [
            {
                "key": "employment",
                "label": "장애인 고용률(정규화)",
                "value": WEIGHT_EMPLOYMENT_RATE,
            },
            {"key": "retention", "label": "근속·유지(프록시)", "value": WEIGHT_RETENTION},
            {"key": "jobDiversity", "label": "직무 다양성", "value": WEIGHT_JOB_DIVERSITY},
            {
                "key": "standardWorkplace",
                "label": "표준사업장 인증",
                "value": WEIGHT_STANDARD_WORKPLACE,
            },
            {
                "key": "workEnvironmentSix",
                "label": "근무환경 6축(공고 평균)",
                "value": WEIGHT_WORK_ENV_SIX,
            },
            {"key": "welfare", "label": "복지·채용 다양성(프록시)", "value": WEIGHT_WELFARE},
        ],
        "compositeFormula": "compositeScore = round(friendlinessScore × 0.7 + regionAccessibility0to100 × 0.3)",
        "updatePolicy": "공공데이터(구인·표준사업장·경기 기관) 갱신 주기에 맞춰 서버에서 재계산합니다.",
    }
