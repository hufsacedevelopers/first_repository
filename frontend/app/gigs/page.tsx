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
            동네에서 부담 없이 연결할 수 있는 장소를 모았습니다.{" "}
            <strong className="font-semibold text-slate-800">
              경기도 Open API「시군별 장애인활동 지원 기관 현황」
            </strong>
            실데이터를 백엔드에서 불러오며, 내 위치를 알려 주시면 좌표가 있는 기관부터 가까운 순으로 정렬합니다.
          </p>

          {usedLiveApi ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-950">
              <strong className="font-semibold">실데이터 모드:</strong> 아래 {rows.length}곳은 경기도 공공 API
              연동 결과입니다. 체험·봉사 일정은 각 기관에 문의해야 합니다.
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
              <strong className="font-semibold">샘플 모드:</strong> 백엔드에{" "}
              <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs">GG_API_KEY</code>가 없거나 API 호출에
              실패한 경우, 기존 시연용 시드 카드만 표시합니다.
            </div>
          )}

          <Suspense fallback={<div className="mt-6 h-24 animate-pulse rounded-2xl bg-slate-100" />}>
            <GigsGeoBar />
          </Suspense>

          {userGeo ? (
            <p className="mt-3 text-xs text-slate-500">
              기준 좌표: {userGeo.lat.toFixed(5)}, {userGeo.lng.toFixed(5)} (URL에 포함되어 공유 가능)
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
                {row.kind === "institution" ? (
                  <span className="mt-1 inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    경기도 API
                  </span>
                ) : null}
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
