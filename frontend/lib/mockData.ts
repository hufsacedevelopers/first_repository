import { Company, Job } from "@/types";

export const companies: Company[] = [
  {
    companyName: "삼성전자",
    location: "경기 수원시",
    industry: "대기업",
    disabledEmploymentRate: 3.2,
    disabledEmployedCount: 267,
    retentionRate: 88,
    jobDiversity: 78,
    friendlinessScore: 92,
    accessibilityGrade: "A",
    standardWorkplaceCertified: true,
    monthlySupportLabel: "80만원/월",
    annualSupportLabel: "연간 최대 960만원",
    subScores: { accessibility: 95, employment: 88, welfare: 93, culture: 91 }
  },
  {
    companyName: "네이버",
    location: "경기 성남시",
    industry: "IT",
    disabledEmploymentRate: 2.8,
    disabledEmployedCount: 156,
    retentionRate: 85,
    jobDiversity: 82,
    friendlinessScore: 88,
    accessibilityGrade: "A",
    standardWorkplaceCertified: true,
    monthlySupportLabel: "80만원/월",
    annualSupportLabel: "연간 최대 960만원",
    subScores: { accessibility: 90, employment: 85, welfare: 89, culture: 88 }
  },
  {
    companyName: "현대자동차",
    location: "서울 강남구",
    industry: "제조",
    disabledEmploymentRate: 2.5,
    disabledEmployedCount: 412,
    retentionRate: 83,
    jobDiversity: 76,
    friendlinessScore: 85,
    accessibilityGrade: "B+",
    standardWorkplaceCertified: false,
    monthlySupportLabel: "60만원/월",
    annualSupportLabel: "연간 최대 720만원",
    subScores: { accessibility: 87, employment: 83, welfare: 86, culture: 84 }
  }
];

export const jobs: Job[] = [
  {
    title: "프론트엔드 개발자",
    companyName: "네이버",
    location: "경기 성남시",
    employmentType: "정규직",
    friendlinessScore: 88,
    matchPercent: 95,
    salaryRange: "연봉 4,000~6,000만원",
    monthlySupportLabel: "80만원/월",
    annualSupportLabel: "(연 960만원)",
    accessibilityTags: ["재택근무", "유연근무", "접근성 우수"]
  },
  {
    title: "데이터 분석가",
    companyName: "카카오",
    location: "제주",
    employmentType: "정규직",
    friendlinessScore: 84,
    matchPercent: 88,
    salaryRange: "연봉 3,500~5,500만원",
    monthlySupportLabel: "80만원/월",
    annualSupportLabel: "(연 960만원)",
    accessibilityTags: ["복지 우수", "장애인 편의시설"]
  },
  {
    title: "UI/UX 디자이너",
    companyName: "토스",
    location: "서울 강남구",
    employmentType: "계약직",
    friendlinessScore: 86,
    matchPercent: 82,
    salaryRange: "연봉 3,800~5,000만원",
    monthlySupportLabel: "60만원/월",
    annualSupportLabel: "(연 720만원)",
    accessibilityTags: ["원격근무", "조직문화 우수"]
  }
];
