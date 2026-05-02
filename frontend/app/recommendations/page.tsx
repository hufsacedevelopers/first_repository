import JobCard from "@/components/JobCard";
import SiteHeader from "@/components/SiteHeader";
import { getJobs } from "@/lib/data";
import { Job } from "@/types";

interface RecommendationsPageProps {
  searchParams: Promise<{
    region?: string;
    employmentType?: string;
    disabilityType?: string;
    keyword?: string;
  }>;
}

// env 필드 기반 장애 유형 접근성 판단
// "해당 조건이 부담이 낮다" = 해당 장애 유형 구직자에게 적합
const DISABILITY_FILTER: Record<string, (job: Job) => boolean> = {
  지체장애: (job) =>
    job.envStndWalk !== "오랫동안 가능",
  시각장애: (job) =>
    job.envEyesight !== "아주 작은 글씨를 읽을 수 있음",
  청각장애: (job) =>
    job.envLstnTalk !== "듣고 말하기에 어려움 없음",
  발달장애: (job) =>
    (!job.envLiftPower || !job.envLiftPower.includes("20Kg")) &&
    job.envStndWalk !== "오랫동안 가능",
  기타: () => true,
};

function matchesFilter(
  job: Job,
  region: string,
  employmentType: string,
  disabilityType: string,
  keyword: string,
): boolean {
  const regionOk = !region || job.location.includes(region);
  const typeOk = !employmentType || job.employmentType === employmentType;
  const disabilityOk =
    !disabilityType || !DISABILITY_FILTER[disabilityType] || DISABILITY_FILTER[disabilityType](job);
  const keywordOk =
    !keyword ||
    job.title.includes(keyword) ||
    job.companyName.includes(keyword) ||
    job.accessibilityTags.some((tag) => tag.includes(keyword));
  return regionOk && typeOk && disabilityOk && keywordOk;
}

export default async function RecommendationsPage({ searchParams }: RecommendationsPageProps) {
  const params = await searchParams;
  const region = params.region?.trim() ?? "";
  const employmentType = params.employmentType?.trim() ?? "";
  const disabilityType = params.disabilityType?.trim() ?? "";
  const keyword = params.keyword?.trim() ?? "";

  const jobs = await getJobs(60);
  const filteredJobs = jobs.filter((job) =>
    matchesFilter(job, region, employmentType, disabilityType, keyword)
  );

  const hasFilter = !!(region || employmentType || disabilityType || keyword);

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            Job Search
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">장애 유형별 일자리 검색</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            장애 유형을 선택하면 근무환경 데이터(서기·시력·청력·중량물 등)를 기반으로
            접근 가능한 공고를 필터링합니다.
          </p>

          <form action="/recommendations" method="get" className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 장애 유형 — 핵심 필터 */}
            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span className="font-medium">장애 유형</span>
              <select
                name="disabilityType"
                defaultValue={disabilityType}
                className="rounded-xl border border-primary-300 bg-primary-50/40 px-3 py-2 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">전체 (장애 유형 무관)</option>
                <option value="지체장애">지체장애 — 서기/걷기 부담 낮은 공고</option>
                <option value="시각장애">시각장애 — 시력 요구 낮은 공고</option>
                <option value="청각장애">청각장애 — 청력 요구 낮은 공고</option>
                <option value="발달장애">발달장애 — 중량 작업이 적은 공고</option>
                <option value="기타">기타 장애 — 환경 조건 무관 전체 공고</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>지역</span>
              <input
                name="region"
                defaultValue={region}
                placeholder="예: 서울, 경기"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>고용형태</span>
              <select
                name="employmentType"
                defaultValue={employmentType}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">전체</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="일용직">일용직</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              <span>키워드</span>
              <input
                name="keyword"
                defaultValue={keyword}
                placeholder="직무명 / 기업명"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <div className="flex items-end gap-2 md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="rounded-xl bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
              >
                검색
              </button>
              {hasFilter && (
                <a
                  href="/recommendations"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  초기화
                </a>
              )}
            </div>
          </form>
        </section>

        {/* 필터 안내 배너 */}
        {disabilityType && DISABILITY_FILTER[disabilityType] && disabilityType !== "기타" && (
          <div className="mt-4 rounded-2xl border border-primary-200 bg-primary-50/60 px-5 py-3 text-sm text-primary-900">
            <span className="font-semibold">{disabilityType}</span> 필터 적용 중 —{" "}
            {disabilityType === "지체장애" && "장시간 서 있는 작업을 요구하지 않는 공고"}
            {disabilityType === "시각장애" && "아주 작은 글씨 판독이 불필요한 공고"}
            {disabilityType === "청각장애" && "완전한 청력·대화 능력이 불필요한 공고"}
            {disabilityType === "발달장애" && "중량 작업이 적고 장시간 기립 작업이 없는 공고"}
            만 표시합니다.
          </div>
        )}

        <section className="mt-8 space-y-4">
          <p className="text-sm text-slate-600">
            검색 결과{" "}
            <span className="font-semibold text-slate-900">{filteredJobs.length}</span>건
            {hasFilter && <span className="ml-1 text-slate-400">(전체 {jobs.length}건 중)</span>}
          </p>

          {filteredJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              <p className="font-medium text-slate-800">조건에 맞는 공고가 없습니다.</p>
              <p className="mt-1">장애 유형이나 지역 조건을 조정해 다시 검색해보세요.</p>
              <a href="/recommendations" className="mt-4 inline-block text-primary-700 underline">
                필터 초기화
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
