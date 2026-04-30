import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-primary-50 via-white to-emerald-50/40 px-8 py-12 shadow-sm md:px-12 md:py-14">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" aria-hidden />
      <p className="relative text-sm font-semibold text-primary-800">
        공공데이터 기반 장애인 취업 의사결정 플랫폼
      </p>
      <h1 className="relative mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
        근무환경 데이터로 찾는
        <br />
        <span className="text-primary-800">내 장애 유형에 맞는</span> 일자리
      </h1>
      <p className="relative mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
        한국장애인고용공단 실시간 구인 데이터와 6개 근무환경 지표를 분석해
        장애 유형별 접근 가능한 일자리를 안내합니다.
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
