import type { Job } from "@/types";

/**
 * 구인 주소에서 뽑는 상위 행정구역 키 (지역별 검색 1단계).
 * `extractRegion` / 실제 공고 `location` 첫 토큰 변형과 맞춤.
 */
export const KOREA_PROVINCE_KEYS = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;

export type KoreaProvinceKey = (typeof KOREA_PROVINCE_KEYS)[number];

const PROVINCE_LABELS: Record<KoreaProvinceKey, string> = {
  서울: "서울특별시",
  부산: "부산광역시",
  대구: "대구광역시",
  인천: "인천광역시",
  광주: "광주광역시",
  대전: "대전광역시",
  울산: "울산광역시",
  세종: "세종특별자치시",
  경기: "경기도",
  강원: "강원특별자치도",
  충북: "충청북도",
  충남: "충청남도",
  전북: "전북특별자치도",
  전남: "전라남도",
  경북: "경상북도",
  경남: "경상남도",
  제주: "제주특별자치도",
};

export function provinceLabel(key: KoreaProvinceKey): string {
  return PROVINCE_LABELS[key];
}

function firstToken(location: string): string {
  return location.trim().split(/\s+/)[0] ?? "";
}

/** 공고 location 첫 토큰 → KOREA_PROVINCE_KEYS 중 하나 또는 null */
export function provinceKeyFromLocation(location: string): KoreaProvinceKey | null {
  const t = firstToken(location);
  if (!t) return null;
  if (t.startsWith("서울")) return "서울";
  if (t.startsWith("부산")) return "부산";
  if (t.startsWith("대구")) return "대구";
  if (t.startsWith("인천")) return "인천";
  /** 경기도 광주시 vs 광주광역시 구분 */
  if (t.startsWith("광주시")) return "경기";
  if (t.startsWith("광주")) return "광주";
  if (t.startsWith("대전")) return "대전";
  if (t.startsWith("울산")) return "울산";
  if (t.startsWith("세종")) return "세종";
  if (t.startsWith("경기")) return "경기";
  if (t.startsWith("강원")) return "강원";
  if (t.startsWith("충북") || t.startsWith("충청북")) return "충북";
  if (t.startsWith("충남") || t.startsWith("충청남")) return "충남";
  if (t.startsWith("전북") || t.startsWith("전라북") || t.startsWith("전북특별")) return "전북";
  if (t.startsWith("전남") || t.startsWith("전라남")) return "전남";
  if (t.startsWith("경북") || t.startsWith("경상북")) return "경북";
  if (t.startsWith("경남") || t.startsWith("경상남")) return "경남";
  if (t.startsWith("제주")) return "제주";
  return null;
}

export function locationMatchesProvinceKey(location: string, key: KoreaProvinceKey): boolean {
  return provinceKeyFromLocation(location) === key;
}

/** 도(키) 이후 주소 조각 — 시·군·구 단계 선택용 */
export function remainderAfterProvinceKey(location: string, key: KoreaProvinceKey): string {
  const parts = location.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return "";
  if (provinceKeyFromLocation(location) !== key) return "";
  return parts.slice(1).join(" ");
}

export function jobsInProvinceKey(jobs: Job[], key: KoreaProvinceKey): Job[] {
  return jobs.filter((j) => locationMatchesProvinceKey(j.location || "", key));
}

export function uniqueSigunguFromJobs(jobs: Job[], key: KoreaProvinceKey): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const j of jobsInProvinceKey(jobs, key)) {
    const rem = remainderAfterProvinceKey(j.location || "", key).trim();
    if (!rem) continue;
    if (seen.has(rem)) continue;
    seen.add(rem);
    out.push(rem);
  }
  out.sort((a, b) => a.localeCompare(b, "ko"));
  return out;
}

export function jobMatchesProvinceAndSigungu(job: Job, key: KoreaProvinceKey, sigungu: string): boolean {
  const s = sigungu.trim();
  if (!s) return false;
  if (!locationMatchesProvinceKey(job.location || "", key)) return false;
  const rem = remainderAfterProvinceKey(job.location || "", key);
  return rem === s || rem.startsWith(s + " ");
}

export function isKoreaProvinceKey(s: string): s is KoreaProvinceKey {
  return (KOREA_PROVINCE_KEYS as readonly string[]).includes(s);
}
