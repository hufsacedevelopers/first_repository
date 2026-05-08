import Link from "next/link";
import { notFound } from "next/navigation";

import JobCard from "@/components/JobCard";
import SiteHeader from "@/components/SiteHeader";
import { getJobs } from "@/lib/data";
import { getJobDomainBySlug, matchesJobDomain } from "@/lib/job-domains";

type DomainJobsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ keyword?: string }>;
};

export default async function DomainJobsPage({ params, searchParams }: DomainJobsPageProps) {
  const { slug } = await params;
  const domain = getJobDomainBySlug(slug);

  if (!domain) {
    notFound();
  }

  const parsedSearchParams = await searchParams;
  const keyword = parsedSearchParams.keyword?.trim() ?? "";

  const jobs = await getJobs(100);
  const domainJobs = jobs.filter((job) => matchesJobDomain(job, domain));
  const filteredJobs = keyword
    ? domainJobs.filter((job) => {
        const searchableText = [job.title, job.companyName, ...job.accessibilityTags].join(" ");
        return searchableText.includes(keyword);
      })
    : domainJobs;

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Domain Jobs</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{domain.label} 채용</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            선택한 도메인 기준으로 공고를 모아 보여줍니다. 검색어를 추가해 더 좁혀볼 수 있습니다.
          </p>

          <form action={`/jobs/domain/${domain.slug}`} method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="domain-keyword">
              도메인 검색어
            </label>
            <input
              id="domain-keyword"
              name="keyword"
              defaultValue={keyword}
              placeholder={`${domain.label} 내 키워드 검색`}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
            >
              검색
            </button>
            {keyword ? (
              <Link
                href={`/jobs/domain/${domain.slug}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                초기화
              </Link>
            ) : null}
          </form>
        </section>

        <section className="mt-8 space-y-4">
          <p className="text-sm text-slate-600">
            검색 결과 <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
            <span className="ml-1 text-slate-400">(도메인 전체 {domainJobs.length}건)</span>
          </p>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              <p className="font-medium text-slate-800">선택한 도메인 조건에 맞는 공고가 없습니다.</p>
              <p className="mt-1">검색어를 바꾸거나 다른 도메인을 선택해보세요.</p>
              <Link href="/" className="mt-4 inline-block text-primary-700 underline">
                홈으로 이동
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
