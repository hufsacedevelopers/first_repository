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
