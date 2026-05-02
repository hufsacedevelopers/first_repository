import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary-100/80 bg-gradient-to-br from-primary-50/90 via-white to-emerald-50/50 px-6 py-10 shadow-md ring-1 ring-primary-100/50 sm:px-10 md:px-12 md:py-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" aria-hidden />

      <p className="relative inline-flex items-center rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-800 shadow-sm backdrop-blur-sm md:text-xs">
        1차 MVP: 경기도 중심 · 공공데이터포털 실시간 연동
      </p>

      <h1 className="relative mt-4 max-w-4xl text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-[1.85rem] md:leading-tight">
        근무환경 데이터로 찾는
        <br />
        <span className="text-primary-900">내 장애 유형에 맞는 일자리</span>
      </h1>

      <p className="relative mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
        경기도 장애인 구직자를 위한 공공데이터 기반 일자리·기업 환경 추천 MVP
      </p>
      <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
        한국장애인고용공단 실시간 구인 API와 근무환경 항목으로 공고와 기업 정보를 빠르게 비교합니다.
      </p>

      <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/recommendations"
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary-700 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:w-auto md:min-w-[14rem]"
        >
          장애 유형별 추천 일자리 보기
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 sm:pt-0">
          <Link
            href="#step-2"
            className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
          >
            STEP 2 · 기업 평가
          </Link>
          <Link
            href="#step-3"
            className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
          >
            STEP 3 · 지원금·공단
          </Link>
        </div>
      </div>
    </section>
  );
}
