import type { CompanyRatingMethodology } from "@/types";

/** 로컬 개발 시 백엔드 없이 방법론 블록을 채우기 위한 스냅샷 (`build_rating_methodology`와 동일 구조) */
export const DEMO_RATING_METHODOLOGY: CompanyRatingMethodology = {
  version: "1.0",
  effectiveDate: "2026-05-13",
  title: "기업별 장애 친화도 정량 평가 및 비교",
  summary:
    "장애인 고용률·표준사업장 인증·근속·직무 다양성·복지 프록시와, 한국장애인고용공단 구인 근무환경(서기·시력·청력·중량물·양손·손 작업) 6축을 공고 단위로 점수화한 뒤 기업별 평균을 반영합니다. 종합 점수는 기업 친화도 70%와 거주 지역 접근성(경기도 장애인활동지원 기관 밀도) 30%로 산출합니다.",
  workEnvDimensionsKo: ["서기", "시력", "청력", "중량물", "양손", "손 작업"],
  weights: [
    { key: "employment", label: "장애인 고용률(정규화)", value: 0.2 },
    { key: "retention", label: "근속·유지(프록시)", value: 0.14 },
    { key: "jobDiversity", label: "직무 다양성", value: 0.12 },
    { key: "standardWorkplace", label: "표준사업장 인증", value: 0.14 },
    { key: "workEnvironmentSix", label: "근무환경 6축(공고 평균)", value: 0.28 },
    { key: "welfare", label: "복지·채용 다양성(프록시)", value: 0.12 },
  ],
  compositeFormula:
    "compositeScore = round(friendlinessScore × 0.7 + regionAccessibility0to100 × 0.3)",
  updatePolicy: "공공데이터(구인·표준사업장·경기 기관) 갱신 주기에 맞춰 서버에서 재계산합니다.",
};
