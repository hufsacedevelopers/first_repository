const steps = [
  {
    step: 1,
    title: "나에게 맞는 조건·장애 유형 선택",
    body: "맞춤 일자리에서 유형과 지역·고용조건을 고릅니다.",
  },
  {
    step: 2,
    title: "기업·공고 환경 정보 확인",
    body: "홈·목록에서 점수와 태그를 보고 상세에서 근무환경까지 확인합니다.",
  },
  {
    step: 3,
    title: "한국장애인고용공단 지원금·상담으로 행동",
    body: "지원금 안내 후 공단 신청·상담 페이지로 연결됩니다.",
  },
];

export default function HomeUserJourney() {
  return (
    <section
      aria-label="서비스 이용 순서"
      className="mt-8 rounded-2xl border border-slate-200/90 bg-white/90 px-6 py-8 shadow-sm md:px-10"
    >
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-primary-700">
        How it works
      </p>
      <h2 className="mt-2 text-center text-lg font-bold text-slate-900 md:text-xl">
        이용 흐름 — 홈 → 추천 → 상세 → 공단
      </h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-4">
        {steps.map(({ step, title, body }) => (
          <li
            key={step}
            className="relative flex gap-4 rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-white px-5 py-4 md:flex-col md:gap-3 md:text-center"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white md:mx-auto">
              {step}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
