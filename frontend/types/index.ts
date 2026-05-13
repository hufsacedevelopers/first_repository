export interface CompanySubScores {
  accessibility: number;
  employment: number;
  welfare: number;
  culture: number;
}

export interface Company {
  id: string;
  companyName: string;
  location: string;
  disabledEmploymentRate: number;
  retentionRate: number;
  jobDiversity: number;
  friendlinessScore: number;
  industry?: string;
  disabledEmployedCount?: number;
  accessibilityGrade?: string;
  standardWorkplaceCertified?: boolean;
  monthlySupportLabel?: string;
  annualSupportLabel?: string;
  subScores?: CompanySubScores;
  /** 기업 친화도 산출 시 각 축의 부분 점수(0–100, API live 소스에서 제공) */
  ratingBreakdown?: Record<string, number>;
  /** 구인 공고 풀에서만 매칭·표준사업장 API 행이 없을 때 합성된 행 */
  derivedFromJobPool?: boolean;
  // 생활 접근성 (경기도 장애인활동지원기관 데이터 기반)
  accessibilityScore?: number; // 0~1 정규화 점수
  compositeScore?: number;     // 종합 점수 0~100
}

/** GET /companies/rating-methodology */
export interface MethodologyWeight {
  key: string;
  label: string;
  value: number;
}

export interface CompanyRatingMethodology {
  version: string;
  effectiveDate: string;
  title: string;
  summary: string;
  workEnvDimensionsKo: string[];
  weights: MethodologyWeight[];
  compositeFormula: string;
  updatePolicy: string;
}

/** GET /accessibility */
export interface AccessibilitySummary {
  regions: {
    sigunNm: string;
    institutionCount: number;
    accessScore: number;
  }[];
  maxCount: number;
  totalInstitutions: number;
}

/** GET /accessibility/institutions */
export interface ActivitySupportInstitution {
  sigunCd: string;
  sigunNm: string;
  instNm: string;
  actAsstnSalaryDivNm: string;
  visitBathSalaryDivNm: string;
  visitNurngSalaryDivNm: string;
  refineLotnoAddr: string;
  refineRoadnmAddr: string;
  refineZipCd: string;
  refineWgs84Lat: string;
  refineWgs84Logt: string;
  telno: string;
  hmpgUrl: string;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  accessibilityTags: string[];
  friendlinessScore?: number;
  matchPercent?: number;
  salaryRange?: string;
  monthlySupportLabel?: string;
  annualSupportLabel?: string;
  // 상세 정보 (실데이터 API)
  recruitmentPeriod?: string;
  entryType?: string;
  requiredCareer?: string;
  requiredEducation?: string;
  requiredMajor?: string;
  agencyName?: string;
  contactNumber?: string;
  applicationDate?: string;
  salaryType?: string;
  // 근무환경 조건 (live-with-env)
  envBothHands?: string;
  envEyesight?: string;
  envHandwork?: string;
  envLiftPower?: string;
  envLstnTalk?: string;
  envStndWalk?: string;
}
