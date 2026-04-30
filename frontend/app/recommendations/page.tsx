import JobCard from "@/components/JobCard";
import SiteHeader from "@/components/SiteHeader";
import { getJobs } from "@/lib/data";
import { Job } from "@/types";

interface RecommendationsPageProps {
  searchParams: {
    region?: string;
    employmentType?: string;
    keyword?: string;
  };
}

function matchesFilter(job: Job, region: string, employmentType: string, keyword: string): boolean {
  const regionOk = !region || job.location.toLowerCase().includes(region.toLowerCase());
  const typeOk =
    !employmentType || job.employmentType.toLowerCase() === employmentType.toLowerCase();
  const keywordOk =
    !keyword ||
    job.title.toLowerCase().includes(keyword.toLowerCase()) ||
    job.companyName.toLowerCase().includes(keyword.toLowerCase()) ||
    job.accessibilityTags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()));
  return regionOk && typeOk && keywordOk;
}

export default async function RecommendationsPage({ searchParams }: RecommendationsPageProps) {
  const region = searchParams.region?.trim() ?? "";
  const employmentType = searchParams.employmentType?.trim() ?? "";
  const keyword = searchParams.keyword?.trim() ?? "";

  const jobs = await getJobs();
  const filteredJobs = jobs.filter((job) => matchesFilter(job, region, employmentType, keyword));

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            Recommendations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">맞춤 일자리 결과</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            조건을 입력하면 현재 데이터 기준으로 맞춤 일자리를 필터링해 보여줍니다.
          </p>

          <form action="/recommendations" method="get" className="mt-6 grid gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              지역
              <input
                name="region"
                defaultValue={region}
                placeholder="예: 서울"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              고용형태
              <select
                name="employmentType"
                defaultValue={employmentType}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">전체</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              키워드
              <input
                name="keyword"
                defaultValue={keyword}
                placeholder="직무/회사/태그"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
              >
                조건 적용
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 space-y-4">
          <p className="text-sm text-slate-600">
            검색 결과 <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
          </p>
          {filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard key={`${job.companyName}-${job.title}`} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              조건에 맞는 일자리가 없습니다. 지역/고용형태/키워드를 조정해 다시 검색해보세요.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
