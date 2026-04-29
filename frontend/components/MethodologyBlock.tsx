export default function MethodologyBlock() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 md:p-8">
      <h3 className="text-lg font-bold text-slate-900">평가 방법론</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        고용노동부, 한국장애인고용공단 등 15개 공공데이터를 수집하여 4개 영역(접근성, 고용, 복지,
        문화)을 정량 평가합니다.
      </p>
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
