import Link from "next/link";
import { notFound } from "next/navigation";
import { extractCompetencyKeywords } from "@/lib/light-gigs";
import { resolveGigDetail } from "@/lib/institution-gigs";
import { haversineKm, parseUserGeoQuery, parseWgs84 } from "@/lib/geo";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lat?: string; lng?: string }>;
}

export default async function LightGigDetailPage({ params, searchParams }: Props) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const sp = await searchParams;
  const userGeo = parseUserGeoQuery(sp.lat, sp.lng);

  const resolved = await resolveGigDetail(id);
  if (!resolved) return notFound();

  if (resolved.kind === "seed") {
    const gig = resolved.gig;
    const competencies = extractCompetencyKeywords(gig.ownerReview);

    return (
      <div className="min-h-screen bg-page">
        <main className="mx-auto max-w-4xl px-6 pb-16 pt-8">
          <Link
            href="/gigs"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800"
          >
            ← 가벼운 일거리 목록
          </Link>

          <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              시연용 샘플
            </span>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
                  {gig.durationHours}시간 체험
                </span>
                <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">{gig.title}</h1>
                <p className="mt-2 text-lg font-medium text-slate-700">{gig.workplaceName}</p>
                <p className="mt-1 text-sm text-slate-500">{gig.sigungu}</p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-slate-700">{gig.summary}</p>

            <section className="mt-8">
              <h2 className="text-sm font-bold text-slate-900">할 일</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-700">
                {gig.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <h2 className="text-sm font-bold text-slate-900">환경·동선 메모</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{gig.environmentNotes}</p>
            </section>

            <section className="mt-8 rounded-2xl border border-violet-200 bg-violet-50/60 p-5">
              <h2 className="text-sm font-bold text-violet-950">사장님 한 줄 후기</h2>
              <blockquote className="mt-2 text-sm italic leading-relaxed text-violet-900">
                &ldquo;{gig.ownerReview}&rdquo;
              </blockquote>
            </section>

            <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <h2 className="text-sm font-bold text-emerald-950">추출된 역량 키워드</h2>
              <p className="mt-1 text-xs text-emerald-800">
                후기 문장을 분석해 자동으로 뽑은 태그입니다.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {competencies.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <h2 className="text-sm font-bold text-slate-900">참고</h2>
              <p className="mt-2 text-sm text-slate-700">{gig.standardWorkplaceCategory}</p>
            </section>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/recommendations"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                일자리 추천으로 이어가기
              </Link>
              <Link
                href="/gigs"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                다른 일거리 보기
              </Link>
            </div>
          </article>
        </main>
      </div>
    );
  }

  const { inst, competencies } = resolved;
  const addr = inst.refineRoadnmAddr?.trim() || inst.refineLotnoAddr?.trim() || "주소 없음";
  const coord = parseWgs84(inst.refineWgs84Lat, inst.refineWgs84Logt);
  let distanceLine: string | null = null;
  if (userGeo && coord) {
    const km = haversineKm(userGeo.lat, userGeo.lng, coord.lat, coord.lng);
    distanceLine = `현재 목록에서 쓴 기준 위치까지 약 ${km.toFixed(1)}km`;
  }

  const serviceBlob = [inst.actAsstnSalaryDivNm, inst.visitBathSalaryDivNm, inst.visitNurngSalaryDivNm]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-4xl px-6 pb-16 pt-8">
        <Link
          href={sp.lat && sp.lng ? `/gigs?lat=${encodeURIComponent(sp.lat)}&lng=${encodeURIComponent(sp.lng)}` : "/gigs"}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800"
        >
          ← 가벼운 일거리 목록
        </Link>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            장애인활동지원 기관
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">{inst.instNm}</h1>
          <p className="mt-2 text-sm text-slate-600">{inst.sigunNm} · 우편번호 {inst.refineZipCd || "—"}</p>

          {distanceLine ? (
            <p className="mt-3 text-sm font-medium text-primary-800">{distanceLine}</p>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              목록에서「내 위치로 정렬」후 이 카드를 열면, 같은 기준으로 거리(km)를 표시할 수 있습니다.
            </p>
          )}

          <section className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
            <h2 className="text-sm font-bold text-slate-900">주소</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-800">{addr}</p>
            {coord ? (
              <p className="mt-2 text-xs text-slate-500">
                위도·경도: {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
              </p>
            ) : (
              <p className="mt-2 text-xs text-amber-800">
                이 기관은 공개 정보에 위치 좌표가 없어 거리 정렬에서 뒤로 밀릴 수 있습니다.
              </p>
            )}
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">전화</h2>
              <p className="mt-1 text-sm font-semibold text-slate-900">{inst.telno || "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">홈페이지</h2>
              {inst.hmpgUrl ? (
                <a
                  href={inst.hmpgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block break-all text-sm font-semibold text-primary-700 hover:underline"
                >
                  링크 열기 ↗
                </a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">등록 없음</p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-bold text-slate-900">급여·서비스 구분</h2>
            <dl className="mt-3 space-y-2 text-sm text-slate-700">
              <div>
                <dt className="text-xs font-semibold text-slate-500">활동지원 급여 구분</dt>
                <dd>{inst.actAsstnSalaryDivNm || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">방문목욕 급여 구분</dt>
                <dd>{inst.visitBathSalaryDivNm || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-slate-500">방문간호 급여 구분</dt>
                <dd>{inst.visitNurngSalaryDivNm || "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <h2 className="text-sm font-bold text-emerald-950">역량 키워드</h2>
            <p className="mt-1 text-xs text-emerald-800">등록된 서비스·급여 구분 문구를 바탕으로 만든 참고 태그입니다.</p>
            {serviceBlob ? (
              <p className="mt-2 text-xs text-emerald-900/80">&ldquo;{serviceBlob}&rdquo;</p>
            ) : null}
            <ul className="mt-4 flex flex-wrap gap-2">
              {competencies.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-8 text-xs leading-relaxed text-slate-500">
            방문·체험 가능 여부와 시간은 기관 정책에 따릅니다. 반드시 사전에 연락하여 확인해 주세요.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/support/gyeonggi-activity-support"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              경기도 활동지원 기관 안내 페이지
            </Link>
            <Link
              href="/gigs"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              목록으로
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
