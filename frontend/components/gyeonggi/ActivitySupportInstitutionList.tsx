import type { ActivitySupportInstitution } from "@/types";

function externalHref(raw: string): string {
  const u = raw.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function kakaoMapHref(inst: ActivitySupportInstitution): string | null {
  const lat = inst.refineWgs84Lat.trim();
  const lng = inst.refineWgs84Logt.trim();
  if (!lat || !lng) return null;
  const la = parseFloat(lat);
  const lo = parseFloat(lng);
  if (Number.isNaN(la) || Number.isNaN(lo)) return null;
  const name = inst.instNm || "기관";
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${la},${lo}`;
}

interface ActivitySupportInstitutionListProps {
  institutions: ActivitySupportInstitution[];
}

export default function ActivitySupportInstitutionList({
  institutions,
}: ActivitySupportInstitutionListProps) {
  if (institutions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center text-sm text-slate-600">
        표시할 기관이 없습니다. 연결 상태를 확인하거나 다른 시·군을 선택해 보세요.
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {institutions.map((inst, idx) => {
        const mapUrl = kakaoMapHref(inst);
        const web = externalHref(inst.hmpgUrl);
        const key = `${inst.sigunCd}-${inst.instNm}-${idx}`;
        return (
          <li
            key={key}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100/80"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-primary-700">
              {inst.sigunNm}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{inst.instNm}</h3>
            <dl className="mt-3 grid gap-2 text-xs text-slate-600">
              <div>
                <dt className="font-medium text-slate-500">도로명 주소</dt>
                <dd className="mt-0.5 leading-relaxed">{inst.refineRoadnmAddr || "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">지번 주소</dt>
                <dd className="mt-0.5 leading-relaxed">{inst.refineLotnoAddr || "—"}</dd>
              </div>
              {inst.refineZipCd ? (
                <div>
                  <dt className="font-medium text-slate-500">우편번호</dt>
                  <dd className="mt-0.5">{inst.refineZipCd}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                활동보조 급여: {inst.actAsstnSalaryDivNm || "—"}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                방문목욕: {inst.visitBathSalaryDivNm || "—"}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                방문간호: {inst.visitNurngSalaryDivNm || "—"}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              {inst.telno ? (
                <a
                  href={`tel:${inst.telno.replace(/\s/g, "")}`}
                  className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  전화 {inst.telno}
                </a>
              ) : null}
              {web ? (
                <a
                  href={web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary-800 transition hover:bg-primary-50"
                >
                  홈페이지
                </a>
              ) : null}
              {mapUrl ? (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100"
                >
                  카카오맵에서 위치
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
