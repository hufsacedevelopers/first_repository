export interface CompanySubScores {
  accessibility: number;
  employment: number;
  welfare: number;
  culture: number;
}

export interface Company {
  companyName: string;
  location: string;
  disabledEmploymentRate: number;
  retentionRate: number;
  jobDiversity: number;
  friendlinessScore: number;
  /** 산업/규모 라벨 (예: 대기업, IT) */
  industry?: string;
  /** 고용 인원 수 (표시용) */
  disabledEmployedCount?: number;
  /** 접근성 등급 */
  accessibilityGrade?: string;
  /** 표준사업장 인증 여부 */
  standardWorkplaceCertified?: boolean;
  /** 월 지원금(만원 단위 등 표시에 맞게 문자열로도 가능) */
  monthlySupportLabel?: string;
  /** 연간 최대 지원금 라벨 */
  annualSupportLabel?: string;
  /** 세부 영역 점수 */
  subScores?: CompanySubScores;
}

export interface Job {
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
}
