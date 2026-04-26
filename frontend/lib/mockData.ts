import { Company, Job } from "@/types";

export const companies: Company[] = [
  {
    companyName: "한빛IT솔루션",
    location: "서울",
    disabledEmploymentRate: 4.1,
    retentionRate: 88,
    jobDiversity: 78,
    friendlinessScore: 86
  },
  {
    companyName: "다온서비스",
    location: "경기",
    disabledEmploymentRate: 3.2,
    retentionRate: 81,
    jobDiversity: 69,
    friendlinessScore: 76
  },
  {
    companyName: "새론물류",
    location: "부산",
    disabledEmploymentRate: 4.8,
    retentionRate: 92,
    jobDiversity: 74,
    friendlinessScore: 89
  }
];

export const jobs: Job[] = [
  {
    title: "웹 접근성 QA 어시스턴트",
    companyName: "한빛IT솔루션",
    location: "서울",
    employmentType: "정규직",
    accessibilityTags: ["재택가능", "보조공학지원", "유연근무"]
  },
  {
    title: "고객지원 코디네이터",
    companyName: "다온서비스",
    location: "경기",
    employmentType: "계약직",
    accessibilityTags: ["근무공간개선", "멘토링제도"]
  },
  {
    title: "물류데이터 운영 담당",
    companyName: "새론물류",
    location: "부산",
    employmentType: "정규직",
    accessibilityTags: ["셔틀운영", "직무적응교육"]
  }
];
