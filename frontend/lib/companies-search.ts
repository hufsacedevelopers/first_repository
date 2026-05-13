import type { Company } from "@/types";

/** 기업명 부분 일치(대소문자 무시). 공백만 있으면 필터하지 않음. */
export function filterCompaniesByQuery(companies: Company[], query: string): Company[] {
  const q = query.trim().toLowerCase();
  if (!q) return companies;
  return companies.filter((c) => c.companyName.toLowerCase().includes(q));
}
