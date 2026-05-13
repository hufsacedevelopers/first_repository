import type { Company } from "@/types";
import { normalizeCompanyNameKey } from "./company-name-normalize";

/** 기업명 부분 일치(원문 또는 정규화 키 기준). */
export function filterCompaniesByQuery(companies: Company[], query: string): Company[] {
  const q = query.trim();
  if (!q) return companies;
  const qKey = normalizeCompanyNameKey(q);
  return companies.filter((c) => {
    const raw = c.companyName;
    if (raw.toLowerCase().includes(q.toLowerCase())) return true;
    const k = normalizeCompanyNameKey(raw);
    return (qKey && k.includes(qKey)) || k.includes(q.toLowerCase().replace(/\s+/g, " "));
  });
}
