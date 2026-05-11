import Link from "next/link";

import { getJobs } from "@/lib/data";

type RegionsPageProps = {
  searchParams: Promise<{ region?: string }>;
};

const GYEONGGI_REGIONS = [
  "성남시",
  "용인시",
  "수원시",
  "고양시",
  "화성시",
  "부천시",
  "안산시",
  "안양시",
  "남양주시",
  "평택시",
  "시흥시",
  "파주시",
  "김포시",
  "의정부시",
  "광주시",
  "하남시",
  "광명시",
  "군포시",
  "오산시",
  "이천시",
] as const;

export default async function RegionsPage({ searchParams }: RegionsPageProps) {
  const params = await searchParams;
  const selectedRegion = params.region?.trim() ?? "";
  const hasSelectedRegion = GYEONGGI_REGIONS.includes(selectedRegion as (typeof GYEONGGI_REGIONS)[number]);

  const jobs = await getJobs(100);
  const filteredJobs = hasSelectedRegion
    ? jobs.filter((job) => job.location.includes(selectedRegion))
    : [];

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Gyeonggi Regions</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">경기도 지역별 검색</h1>
          <p className="mt-3 text-sm text-slate-600">경기도 주요 시 기준으로 공고를 빠르게 나눠서 볼 수 있습니다.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {GYEONGGI_REGIONS.map((region) => (
              <Link
                key={region}
                href={`/jobs/regions?region=${encodeURIComponent(region)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedRegion === region
                    ? "bg-primary-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {region}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4">
          {!hasSelectedRegion ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base font-semibold text-slate-800">먼저 지역을 선택해주세요.</p>
              <p className="mt-2 text-sm text-slate-600">
                선택한 지역의 공고만 아래에 게시물 형식으로 표시됩니다.
              </p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{selectedRegion}</span> 검색 결과{" "}
                <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
              </p>
              {filteredJobs.map((job) => (
                <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                      <p className="mt-1 text-sm font-medium text-slate-700">{job.companyName}</p>
                      <p className="mt-1 text-sm text-slate-500">{job.location}</p>
                    </div>
                    <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
                      {job.employmentType}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.accessibilityTags.slice(0, 4).map((tag) => (
                      <span key={`${job.id}-${tag}`} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/job/${job.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      공고 상세 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              해당 지역 기준으로 매칭된 공고가 없습니다.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
