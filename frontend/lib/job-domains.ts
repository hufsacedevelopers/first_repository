import { Job } from "@/types";

export type JobDomain = {
  slug: string;
  label: string;
  keywords: string[];
};

export const JOB_DOMAINS: JobDomain[] = [
  { slug: "it-development", label: "IT·개발", keywords: ["개발", "프로그래머", "IT", "데이터", "엔지니어"] },
  { slug: "design-media", label: "디자인·미디어", keywords: ["디자인", "콘텐츠", "편집", "영상", "마케팅"] },
  { slug: "office-admin", label: "사무·행정", keywords: ["사무", "행정", "총무", "회계", "인사"] },
  { slug: "sales-customer", label: "영업·고객상담", keywords: ["영업", "상담", "CS", "고객", "TM"] },
  { slug: "manufacturing-production", label: "생산·제조", keywords: ["생산", "제조", "조립", "가공", "품질"] },
  { slug: "logistics-delivery", label: "물류·배송", keywords: ["물류", "배송", "창고", "포장", "운송"] },
  { slug: "service-food", label: "서비스·외식", keywords: ["서비스", "매장", "주방", "조리", "카페"] },
  { slug: "education-care", label: "교육·돌봄", keywords: ["교육", "강사", "교사", "돌봄", "복지"] },
  { slug: "public-npo", label: "공공·비영리", keywords: ["공공", "행정", "기관", "사회복지", "비영리"] },
  { slug: "healthcare", label: "의료·보건", keywords: ["의료", "보건", "간호", "요양", "병원"] },
];

export function getJobDomainBySlug(slug: string): JobDomain | undefined {
  return JOB_DOMAINS.find((domain) => domain.slug === slug);
}

export function matchesJobDomain(job: Job, domain: JobDomain): boolean {
  const searchableText = [job.title, job.companyName, ...job.accessibilityTags]
    .join(" ")
    .toLowerCase();

  return domain.keywords.some((keyword) => searchableText.includes(keyword.toLowerCase()));
}
