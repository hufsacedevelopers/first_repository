export interface Company {
  companyName: string;
  location: string;
  disabledEmploymentRate: number;
  retentionRate: number;
  jobDiversity: number;
  friendlinessScore: number;
}

export interface Job {
  title: string;
  companyName: string;
  location: string;
  employmentType: string;
  accessibilityTags: string[];
}
