import SiteHeader from "@/components/SiteHeader";
import { getJobs } from "@/lib/data";

function countBy<T>(items: T[], getKey: (item: T) => string): Array<{ label: string; count: number }> {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = getKey(item);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export default async function JobInsightsPage() {
  const jobs = await getJobs(200);

  const byEmploymentType = countBy(jobs, (job) => job.employmentType || "기타");
  const byRegion = countBy(jobs, (job) => {
    const location = job.location || "기타 지역";
    return location.split(" ").slice(0, 2).join(" ");
  });

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Job Insights</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">공고 데이터 요약</h1>
          <p className="mt-3 text-sm text-slate-600">
            현재 연동된 채용 데이터의 분포를 빠르게 파악할 수 있는 요약 화면입니다.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            전체 공고 수 <span className="font-semibold text-slate-900">{jobs.length}</span>건
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">고용형태 분포</h2>
            <ul className="mt-4 space-y-2">
              {byEmploymentType.map((item) => (
                <li key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.count}건</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">지역 분포 (상위 8)</h2>
            <ul className="mt-4 space-y-2">
              {byRegion.map((item) => (
                <li key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.count}건</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
