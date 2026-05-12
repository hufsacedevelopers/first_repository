import { getJobs, getLiveJobsComparison, getLiveJobsMergedMeta } from "@/lib/data";

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
  const [jobs, comparison, merged] = await Promise.all([
    getJobs(200),
    getLiveJobsComparison(),
    getLiveJobsMergedMeta(),
  ]);
  const { meta: mergedMeta, isEstimated } = merged;
  const missingEnvCount = Math.max(0, comparison.jobListTotal - comparison.jobListEnvTotal);
  const missingEnvRate =
    comparison.jobListTotal > 0 ? Math.round((missingEnvCount / comparison.jobListTotal) * 1000) / 10 : 0;

  const byEmploymentType = countBy(jobs, (job) => job.employmentType || "기타");
  const byRegion = countBy(jobs, (job) => {
    const location = job.location || "기타 지역";
    return location.split(" ").slice(0, 2).join(" ");
  });

  return (
    <div className="min-h-screen bg-page">
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
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">전체 구인 공고</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{comparison.jobListTotal.toLocaleString()}건</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">근무환경 포함 공고</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{comparison.jobListEnvTotal.toLocaleString()}건</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">상기 두 목록 차이</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {(comparison.jobListTotal - comparison.jobListEnvTotal).toLocaleString()}건
              </p>
              <p className="text-xs text-slate-500">근무환경 항목 포함 여부에 따른 차이</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">근무환경 정보 누락 비율</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{missingEnvRate}%</p>
              <p className="text-xs text-slate-500">
                누락 {missingEnvCount.toLocaleString()}건 / 전체 {comparison.jobListTotal.toLocaleString()}건
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">데이터 수집 요약</h2>
          <p className="mt-1 text-sm text-slate-500">여러 출처에서 가져온 공고를 합칠 때의 요약 지표입니다.</p>
          {isEstimated ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
              병합 상세 API를 쓰지 못한 경우, 상단「전체 구인 / 근무환경 포함」집계와 같은 출처로만 채운 참고치입니다.
              서버 주소가 설정되어 있고 공공 구인 연동이 정상이면 실제 수집·병합 수치로 바뀝니다.
            </p>
          ) : null}
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">실제 수집 페이지 수</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {isEstimated ? "—" : `${mergedMeta.collectedPages}p`}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                {isEstimated ? "근무환경 공고 비중(추정)" : "병합 매칭률"}
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">{mergedMeta.mergeMatchRate}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">일반·환경 포함 수집 건수</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {mergedMeta.rawCollectedCount}/{mergedMeta.envCollectedCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">{isEstimated ? "표시 상한(추정)" : "병합 결과 건수"}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{mergedMeta.mergedCount}건</p>
            </div>
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
