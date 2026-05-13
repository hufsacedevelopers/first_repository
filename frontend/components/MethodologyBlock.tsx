import { getRatingMethodology } from "@/lib/data";

export default async function MethodologyBlock() {
  const m = await getRatingMethodology();

  const summary =
    m?.summary ??
    "장애인 고용률·표준사업장 인증·근속·직무 다양성·복지 지표와, 한국장애인고용공단 구인의 근무환경(서기·시력·청력·중량물·양손·손 작업) 6축을 공고 단위로 점수화한 뒤 기업별로 가중 합산합니다.";

  const dimensions =
    m?.workEnvDimensionsKo ?? ["서기", "시력", "청력", "중량물", "양손", "손 작업"];

  const weights = m?.weights ?? null;
  const compositeFormula =
    m?.compositeFormula ??
    "compositeScore = round(friendlinessScore × 0.7 + regionAccessibility0to100 × 0.3)";
  const updatePolicy =
    m?.updatePolicy ?? "공공데이터 갱신 시 서버에서 점수를 재계산합니다.";

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 md:p-8">
      <h3 className="text-lg font-bold text-slate-900">평가 방법론</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-500">근무환경 6축:</span>
        {dimensions.map((d) => (
          <span
            key={d}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700"
          >
            {d}
          </span>
        ))}
      </div>

      {weights && weights.length > 0 ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">기업 친화도 가중치 (합계 100%)</p>
          <ul className="mt-3 divide-y divide-slate-100">
            {weights.map((w) => (
              <li key={w.key} className="flex items-center justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0">
                <span className="text-slate-600">{w.label}</span>
                <span className="shrink-0 font-mono tabular-nums font-semibold text-slate-900">
                  {(w.value * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed text-slate-700">
            {compositeFormula}
          </p>
          <p className="mt-2 text-xs text-slate-500">{updatePolicy}</p>
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-500">
          API에 연결되면 위와 동일한 가중치·종합식이 서버에서 내려와 이 영역에 표시됩니다.
        </p>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">월간 업데이트</p>
          <p className="mt-1 text-xs text-slate-600">공공데이터 갱신 시 자동으로 점수 재계산</p>
        </li>
        <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">투명한 산출 근거</p>
          <p className="mt-1 text-xs text-slate-600">모든 지표와 가중치를 상세히 공개</p>
        </li>
        <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">정부 공식 데이터</p>
          <p className="mt-1 text-xs text-slate-600">공공데이터포털 인증 데이터만 사용</p>
        </li>
      </ul>
    </div>
  );
}
