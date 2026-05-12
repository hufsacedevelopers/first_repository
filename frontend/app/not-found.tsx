import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-primary-100/60 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-20 h-48 w-48 rounded-full bg-emerald-100/50 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50/80 blur-2xl"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg ring-4 ring-primary-100/80">
          <span className="text-5xl" role="img" aria-hidden>
            🧭
          </span>
        </div>

        <p className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-800">
          <span aria-hidden>✨</span>
          404 · 페이지를 찾을 수 없어요
        </p>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          여기는 아직 길이 열리지 않았어요
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600">
          주소가 바뀌었거나, 오타가 있거나, 아직 만들어지지 않은 페이지일 수 있어요.
          <span className="mt-1 block text-slate-500">걱정 마세요 — 아래에서 다시 출발해 볼까요?</span>
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/recommendations"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/50"
          >
            일자리 찾아보기
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          <span className="mr-1" aria-hidden>
            💡
          </span>
          자주 쓰는 메뉴는 상단 <span className="font-semibold text-slate-500">가벼운 일거리</span> ·{" "}
          <span className="font-semibold text-slate-500">서비스 소개</span>에서도 이동할 수 있어요.
        </p>
      </div>
    </div>
  );
}
