import { normalizeCompanyNameKey, rawNameMatchesCompanySearch } from "@/lib/company-name-normalize";
import type { Company, Job } from "@/types";

/** 구인 공고에서만 유래한 기업 행 — 상세 URL `jp:인코딩된기업명` */
export const JOB_POOL_COMPANY_ID_PREFIX = "jp:";

export function companyIdFromJobPool(name: string): string {
  return `${JOB_POOL_COMPANY_ID_PREFIX}${encodeURIComponent(name.trim())}`;
}

export function companyNameFromJobPoolId(id: string): string | null {
  if (!id.startsWith(JOB_POOL_COMPANY_ID_PREFIX)) return null;
  try {
    return decodeURIComponent(id.slice(JOB_POOL_COMPANY_ID_PREFIX.length));
  } catch {
    return null;
  }
}

function averageFriendliness(rows: Job[]): number {
  const scores = rows.map((j) => j.friendlinessScore ?? 65);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** 표준사업장 API에 없을 때, 일자리 검색과 동일한 공고 풀에서 친화도·세부를 추정 */
export function synthesizeCompanyFromJobPool(name: string, rows: Job[]): Company {
  const avg = averageFriendliness(rows);
  const titles = new Set(rows.map((r) => r.title));
  const diversity = Math.min(100, Math.max(35, titles.size * 14));
  const location = rows[0]?.location ?? "지역 미상";

  return {
    id: companyIdFromJobPool(name),
    companyName: name.trim(),
    location,
    disabledEmploymentRate: 2.8,
    retentionRate: 76,
    jobDiversity: diversity,
    friendlinessScore: avg,
    derivedFromJobPool: true,
    disabledEmployedCount: rows.length,
    accessibilityGrade: avg >= 85 ? "A" : avg >= 72 ? "B+" : avg >= 60 ? "B" : "C",
    standardWorkplaceCertified: undefined,
    subScores: {
      accessibility: Math.min(100, avg + 2),
      employment: 68,
      welfare: 70,
      culture: Math.min(100, Math.round((76 + diversity) / 2)),
    },
  };
}

/**
 * 장애 유형별 일자리 검색(`getJobs`)에 노출되는 기업명과 동일한 풀을 사용합니다.
 * 백엔드 기업 목록에 있으면 그 데이터를 우선하고, 없으면 공고 근무환경 점수로 합성합니다.
 */
export function mergeCompaniesForJobPoolSearch(
  query: string,
  jobs: Job[],
  apiCompanies: Company[],
): Company[] {
  const q = query.trim();
  if (!q) return apiCompanies;

  const apiByNorm = new Map<string, Company>();
  for (const c of apiCompanies) {
    const k = normalizeCompanyNameKey(c.companyName);
    if (k && !apiByNorm.has(k)) apiByNorm.set(k, c);
  }

  /** 정규화 키 → 대표 표기명(가장 긴 원문) + 공고 */
  const byNorm = new Map<string, { displayName: string; jobs: Job[] }>();
  for (const job of jobs) {
    const raw = job.companyName?.trim();
    if (!raw || !rawNameMatchesCompanySearch(raw, q)) continue;
    const norm = normalizeCompanyNameKey(raw);
    if (!norm) continue;
    let bucket = byNorm.get(norm);
    if (!bucket) {
      bucket = { displayName: raw, jobs: [] };
      byNorm.set(norm, bucket);
    } else if (raw.length > bucket.displayName.length) {
      bucket.displayName = raw;
    }
    bucket.jobs.push(job);
  }

  const out: Company[] = [];
  for (const [norm, { displayName, jobs: rows }] of byNorm) {
    const apiHit = apiByNorm.get(norm);
    if (apiHit) {
      out.push({ ...apiHit });
    } else {
      out.push(synthesizeCompanyFromJobPool(displayName, rows));
    }
  }

  out.sort((a, b) => b.friendlinessScore - a.friendlinessScore);
  return out;
}
