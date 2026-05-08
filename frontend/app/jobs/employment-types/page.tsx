import Link from "next/link";

import JobCard from "@/components/JobCard";
import SiteHeader from "@/components/SiteHeader";
import { getJobs } from "@/lib/data";

type EmploymentTypesPageProps = {
  searchParams: Promise<{ employmentType?: string }>;
};

const EMPLOYMENT_TYPES = ["정규직", "계약직", "일용직"] as const;

export default async function EmploymentTypesPage({ searchParams }: EmploymentTypesPageProps) {
  const params = await searchParams;
  const selectedType = EMPLOYMENT_TYPES.includes(params.employmentType as (typeof EMPLOYMENT_TYPES)[number])
    ? (params.employmentType as (typeof EMPLOYMENT_TYPES)[number])
    : "";

  const jobs = await getJobs(100);
  const filteredJobs = selectedType ? jobs.filter((job) => job.employmentType === selectedType) : [];
  const employmentSummary = EMPLOYMENT_TYPES.map((type) => ({
    type,
    count: jobs.filter((job) => job.employmentType === type).length,
  }));

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Employment Type</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">정규직/계약직 찾기</h1>
          <p className="mt-3 text-sm text-slate-600">고용형태별로 공고를 모아 빠르게 비교할 수 있습니다.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <Link
                key={type}
                href={`/jobs/employment-types?employmentType=${encodeURIComponent(type)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedType === type
                    ? "bg-primary-700 text-white"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">고용형태 현황</h2>
            <ul className="mt-4 space-y-2">
              {employmentSummary.map((item) => (
                <li key={item.type} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{item.type}</span>
                  <span className="font-semibold text-slate-900">{item.count}건</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-4">
            {!selectedType ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-base font-semibold text-slate-800">고용형태를 선택하면 공고가 표시됩니다.</p>
                <p className="mt-2 text-sm text-slate-600">정규직/계약직/일용직 중 하나를 먼저 선택해주세요.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{selectedType}</span> 검색 결과{" "}
                  <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
