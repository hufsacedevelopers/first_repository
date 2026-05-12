import Link from "next/link";
import { Suspense } from "react";
import GigsGeoBar from "@/components/gigs/GigsGeoBar";
import { listGigRowsForPage } from "@/lib/institution-gigs";

interface PageProps {
  searchParams: Promise<{ lat?: string; lng?: string }>;
}

export default async function LightGigsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { rows, usedLiveApi, userGeo } = await listGigRowsForPage(sp.lat, sp.lng);

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Light gigs</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">가벼운 일거리</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            동네에서 부담 없이 연결할 수 있는 장소를 모았습니다. 경기도에서 공개하는{" "}
            <strong className="font-semibold text-slate-800">시·군별 장애인활동 지원 기관</strong> 정보를 불러오며,
            내 위치를 알려 주시면 위치 정보가 있는 기관부터 가까운 순으로 정렬합니다.
          </p>

          {usedLiveApi ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950">
              <strong className="font-semibold">안내:</strong> 아래 {rows.length}곳은 최신 공개 목록을 기준으로
              보여 줍니다. 체험·봉사 일정은 각 기관에 문의해야 합니다.
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
              <strong className="font-semibold">샘플 모드:</strong> 지금은 예시 카드만 표시됩니다. 기관 목록을
              보려면 서버가 켜져 있고 경기도 기관 정보 연동 설정이 되어 있어야 합니다.
            </div>
          )}

          <Suspense fallback={<div className="mt-6 h-24 animate-pulse rounded-2xl bg-slate-100" />}>
            <GigsGeoBar />
          </Suspense>

          {userGeo ? (
            <p className="mt-3 text-xs text-slate-500">
              기준 위치: {userGeo.lat.toFixed(5)}, {userGeo.lng.toFixed(5)} · 이 화면 링크를 저장하면 같은 기준으로
              다시 열 수 있습니다.
            </p>
          ) : null}
        </section>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => {
            const detailQuery =
              userGeo != null
                ? `?lat=${encodeURIComponent(String(userGeo.lat))}&lng=${encodeURIComponent(String(userGeo.lng))}`
                : "";
            return (
            <li key={row.id}>
              <Link
                href={`/gigs/${encodeURIComponent(row.id)}${detailQuery}`}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {row.metaRight}
                </span>
                <h2 className="mt-2 text-lg font-bold text-slate-900">{row.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-700">{row.workplaceLabel}</p>
                <p className="mt-0.5 text-xs text-slate-500">{row.sigungu}</p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{row.summary}</p>
                <span className="mt-4 text-sm font-semibold text-primary-700">자세히 보기 →</span>
              </Link>
            </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
