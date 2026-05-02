import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary-100/80 bg-gradient-to-br from-primary-50/90 via-white to-emerald-50/50 px-8 py-12 shadow-md ring-1 ring-primary-100/50 md:px-12 md:py-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" aria-hidden />

      <p className="relative inline-flex items-center rounded-full border border-emerald-200/80 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-800 shadow-sm backdrop-blur-sm md:text-xs">
        1차 MVP: 경기도 중심 · 공공데이터포털 실시간 연동
      </p>

      <h1 className="relative mt-4 max-w-4xl text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-3xl md:leading-tight">
        경기도 장애인 구직자를 위한
        <br className="hidden sm:block" />
        <span className="text-primary-800"> 공공데이터 기반 일자리·기업 환경 추천 MVP</span>
      </h1>

      <p className="relative mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-700 md:text-lg">
        근무환경 데이터로 &apos;내 조건&apos;을 한눈에 비교합니다.
      </p>
      <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
        한국장애인고용공단 실시간 구인 정보와 근무환경 항목을 연결해 장애 유형에 맞는 공고 탐색을 돕습니다.
      </p>

      <div className="relative mt-8 flex flex-wrap gap-3">
        <Link
          href="/recommendations"
          className="inline-flex items-center justify-center rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          장애 유형별 일자리 찾기
        </Link>
        <Link
          href="#companies"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          기업 평가 보기
        </Link>
      </div>
    </section>
  );
}
