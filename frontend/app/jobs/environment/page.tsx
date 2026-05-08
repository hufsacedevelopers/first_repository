import Link from "next/link";

import JobCard from "@/components/JobCard";
import SiteHeader from "@/components/SiteHeader";
import { getJobs } from "@/lib/data";
import { Job } from "@/types";

type EnvironmentPageProps = {
  searchParams: Promise<{ env?: string }>;
};

const ENV_FILTERS = [
  { key: "standing-light", label: "장시간 서기 부담 낮음" },
  { key: "hearing-light", label: "청취/대화 부담 낮음" },
  { key: "vision-light", label: "시력 요구 부담 낮음" },
  { key: "lifting-light", label: "중량물 부담 낮음" },
] as const;

function matchesEnvironment(job: Job, filterKey: string): boolean {
  if (filterKey === "standing-light") return job.envStndWalk !== "오랫동안 가능";
  if (filterKey === "hearing-light") return job.envLstnTalk !== "듣고 말하기에 어려움 없음";
  if (filterKey === "vision-light") return job.envEyesight !== "아주 작은 글씨를 읽을 수 있음";
  if (filterKey === "lifting-light") return !job.envLiftPower || !job.envLiftPower.includes("20Kg");
  return true;
}

export default async function EnvironmentPage({ searchParams }: EnvironmentPageProps) {
  const params = await searchParams;
  const selectedEnv = params.env?.trim() ?? "";
  const isValid = ENV_FILTERS.some((filter) => filter.key === selectedEnv);

  const jobs = await getJobs(100);
  const filteredJobs = isValid ? jobs.filter((job) => matchesEnvironment(job, selectedEnv)) : [];

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Work Environment</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">근무환경 조건 탐색</h1>
          <p className="mt-3 text-sm text-slate-600">
            공고의 근무환경 항목을 기준으로 조건에 맞는 일자리를 모아볼 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ENV_FILTERS.map((filter) => (
              <Link
                key={filter.key}
                href={`/jobs/environment?env=${filter.key}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedEnv === filter.key
                    ? "bg-primary-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4">
          {!isValid ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base font-semibold text-slate-800">근무환경 조건을 먼저 선택해주세요.</p>
              <p className="mt-2 text-sm text-slate-600">
                선택한 조건에 맞는 공고만 추천 형태로 표시됩니다.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                검색 결과 <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
              </p>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">조건 해석 가이드</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>장시간 서기 부담 낮음: `envStndWalk`가 장시간 가능으로 명시되지 않은 공고 우선</li>
            <li>청취/대화 부담 낮음: `envLstnTalk` 부담이 낮은 항목 우선</li>
            <li>시력 요구 부담 낮음: `envEyesight` 고시력 요구가 낮은 항목 우선</li>
            <li>중량물 부담 낮음: `envLiftPower`에서 고중량(20kg) 요구가 낮은 항목 우선</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
