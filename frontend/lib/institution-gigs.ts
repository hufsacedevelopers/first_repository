import type { ActivitySupportInstitution } from "@/types";
import { getAccessibilityInstitutions } from "@/lib/data";
import { extractCompetencyKeywords, getLightGigs, type LightGig } from "@/lib/light-gigs";
import { haversineKm, parseUserGeoQuery, parseWgs84 } from "@/lib/geo";

const LIST_CAP = 100;

/** 목록 카드용 (기관 실데이터 + 시드 공통). */
export interface ListedGigRow {
  id: string;
  kind: "institution" | "seed";
  title: string;
  workplaceLabel: string;
  sigungu: string;
  summary: string;
  metaRight: string;
  distanceKm: number | null;
}

function stableInstitutionId(inst: ActivitySupportInstitution): string {
  const key = [inst.sigunCd, inst.instNm, inst.refineRoadnmAddr, inst.refineLotnoAddr].join("|");
  let h = 5381;
  for (let i = 0; i < key.length; i++) {
    h = (h * 33) ^ key.charCodeAt(i);
  }
  const n = (h >>> 0).toString(36).padStart(8, "0");
  return `ggi-${n}`;
}

function institutionSummary(inst: ActivitySupportInstitution): string {
  const road = inst.refineRoadnmAddr?.trim();
  const jibun = inst.refineLotnoAddr?.trim();
  const addr = road || jibun || "주소 정보 없음";
  const parts = [addr];
  if (inst.actAsstnSalaryDivNm) parts.push(`활동지원: ${inst.actAsstnSalaryDivNm}`);
  return parts.join(" · ");
}

function institutionMeta(inst: ActivitySupportInstitution, distanceKm: number | null): string {
  if (distanceKm != null) return `${distanceKm.toFixed(1)}km · ${inst.sigunNm || "경기"}`;
  if (inst.refineWgs84Lat && inst.refineWgs84Logt) return `좌표 등록 · ${inst.sigunNm || "경기"}`;
  return `거리 계산 불가 · ${inst.sigunNm || "경기"}`;
}

export async function listGigRowsForPage(
  lat?: string,
  lng?: string
): Promise<{ rows: ListedGigRow[]; usedLiveApi: boolean; userGeo: { lat: number; lng: number } | null }> {
  const userGeo = parseUserGeoQuery(lat, lng);
  const institutions = await getAccessibilityInstitutions();

  if (institutions.length > 0) {
    const enriched = institutions.map((inst) => {
      const id = stableInstitutionId(inst);
      const coord = parseWgs84(inst.refineWgs84Lat, inst.refineWgs84Logt);
      let distanceKm: number | null = null;
      if (userGeo && coord) {
        distanceKm = haversineKm(userGeo.lat, userGeo.lng, coord.lat, coord.lng);
      }
      return { inst, id, distanceKm };
    });

    enriched.sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm != null) return -1;
      if (b.distanceKm != null) return 1;
      const sa = `${a.inst.sigunNm}${a.inst.instNm}`;
      const sb = `${b.inst.sigunNm}${b.inst.instNm}`;
      return sa.localeCompare(sb, "ko");
    });

    const rows: ListedGigRow[] = enriched.slice(0, LIST_CAP).map(({ inst, id, distanceKm }) => ({
      id,
      kind: "institution" as const,
      title: inst.instNm || "이름 미상 기관",
      workplaceLabel: "경기도 장애인활동지원 기관",
      sigungu: inst.sigunNm ? `${inst.sigunNm}` : "경기도",
      summary: institutionSummary(inst),
      metaRight: institutionMeta(inst, distanceKm),
      distanceKm,
    }));

    return { rows, usedLiveApi: true, userGeo };
  }

  const seeds = await getLightGigs();
  const rows: ListedGigRow[] = seeds.map((g) => ({
    id: g.id,
    kind: "seed",
    title: g.title,
    workplaceLabel: g.workplaceName,
    sigungu: g.sigungu,
    summary: g.summary,
    metaRight: `${g.durationHours}시간 · ${g.sigungu}`,
    distanceKm: null,
  }));

  return { rows, usedLiveApi: false, userGeo };
}

export async function resolveGigDetail(id: string): Promise<
  | { kind: "seed"; gig: LightGig }
  | { kind: "institution"; inst: ActivitySupportInstitution; competencies: string[] }
  | null
> {
  const seeds = await getLightGigs();
  const seed = seeds.find((g) => g.id === id);
  if (seed) return { kind: "seed", gig: seed };

  const institutions = await getAccessibilityInstitutions();
  for (const inst of institutions) {
    if (stableInstitutionId(inst) === id) {
      const blob = [inst.actAsstnSalaryDivNm, inst.visitBathSalaryDivNm, inst.visitNurngSalaryDivNm]
        .filter(Boolean)
        .join(" ");
      const competencies = extractCompetencyKeywords(blob || "지역 연결 활동 지원");
      return { kind: "institution", inst, competencies };
    }
  }
  return null;
}
