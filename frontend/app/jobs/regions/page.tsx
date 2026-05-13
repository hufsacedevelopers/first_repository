import Link from "next/link";

import JobCard from "@/components/JobCard";
import { getJobs } from "@/lib/data";
import {
  KOREA_PROVINCE_KEYS,
  isKoreaProvinceKey,
  jobMatchesProvinceAndSigungu,
  jobsInProvinceKey,
  provinceLabel,
  uniqueSigunguFromJobs,
} from "@/lib/job-regions";

type RegionsPageProps = {
  searchParams: Promise<{
    province?: string;
    sigungu?: string;
    all?: string;
  }>;
};

export default async function RegionsPage({ searchParams }: RegionsPageProps) {
  const params = await searchParams;
  const provinceRaw = params.province?.trim() ?? "";
  const sigungu = params.sigungu?.trim() ?? "";
  const showAllInProvince = params.all === "1";

  const province = isKoreaProvinceKey(provinceRaw) ? provinceRaw : null;

  const jobs = await getJobs(200);

  const inProvince = province ? jobsInProvinceKey(jobs, province) : [];
  const sigunguOptions = province ? uniqueSigunguFromJobs(jobs, province) : [];

  const filteredJobs =
    province && (showAllInProvince || sigungu)
      ? showAllInProvince
        ? inProvince
        : inProvince.filter((j) => jobMatchesProvinceAndSigungu(j, province, sigungu))
      : [];

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Regional search</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">지역별 검색</h1>
          <p className="mt-3 text-sm text-slate-600">
            시·도를 고른 뒤, 시·군·구를 선택하면 해당 지역 공고만 모아서 볼 수 있습니다.
          </p>

          {/* 1단계: 도 선택 */}
          {!province ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-800">1단계 · 시·도 선택</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {KOREA_PROVINCE_KEYS.map((key) => {
                  const count = jobsInProvinceKey(jobs, key).length;
                  return (
                    <li key={key}>
                      <Link
                        href={`/jobs/regions?province=${encodeURIComponent(key)}`}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-primary-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      >
                        <span>{provinceLabel(key)}</span>
                        <span className="tabular-nums text-xs text-slate-500">{count}건</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
                <Link
                  href="/jobs/regions"
                  className="text-sm font-medium text-primary-800 underline-offset-4 hover:underline"
                >
                  ← 시·도 다시 선택
                </Link>
                <span className="text-sm text-slate-400">|</span>
                <p className="text-sm text-slate-700">
                  선택한 지역: <span className="font-semibold text-slate-900">{provinceLabel(province)}</span>
                </p>
              </div>

              {/* 2단계: 시·군·구 */}
              {!showAllInProvince && !sigungu ? (
                <div>
                  <p className="text-sm font-semibold text-slate-800">2단계 · 시·군·구 선택</p>
                  <p className="mt-1 text-xs text-slate-500">
                    주소에 시·군이 붙어 있지 않은 공고는 아래 &quot;구분 없이 모두 보기&quot;로 확인할 수
                    있습니다.
                  </p>
                  {sigunguOptions.length > 0 ? (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {sigunguOptions.map((name) => {
                        const count = inProvince.filter((j) =>
                          jobMatchesProvinceAndSigungu(j, province, name),
                        ).length;
                        return (
                          <li key={name}>
                            <Link
                              href={`/jobs/regions?province=${encodeURIComponent(province)}&sigungu=${encodeURIComponent(name)}`}
                              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-primary-300 hover:bg-primary-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                            >
                              <span className="min-w-0 truncate">{name}</span>
                              <span className="ml-2 shrink-0 tabular-nums text-xs text-slate-500">
                                {count}건
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                      이 시·도로 묶인 공고에 시·군·구 단위 주소가 없습니다.
                    </p>
                  )}
                  {inProvince.length > 0 ? (
                    <div className="mt-6">
                      <Link
                        href={`/jobs/regions?province=${encodeURIComponent(province)}&all=1`}
                        className="inline-flex rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-primary-100"
                      >
                        시·군 구분 없이 이 도 공고 모두 보기 ({inProvince.length}건)
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/jobs/regions?province=${encodeURIComponent(province)}`}
                      className="text-sm font-medium text-primary-800 underline-offset-4 hover:underline"
                    >
                      ← 시·군·구 다시 선택
                    </Link>
                    {showAllInProvince ? (
                      <span className="text-xs text-slate-500">전체 공고</span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{sigungu}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="mt-8 space-y-4">
          {province && (showAllInProvince || sigungu) ? (
            filteredJobs.length > 0 ? (
              <>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{provinceLabel(province)}</span>
                  {!showAllInProvince && sigungu ? (
                    <>
                      {" "}
                      · <span className="font-semibold text-slate-900">{sigungu}</span>
                    </>
                  ) : null}{" "}
                  · <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
                </p>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
                조건에 맞는 공고가 없습니다.
              </div>
            )
          ) : null}
        </section>
      </main>
    </div>
  );
}
