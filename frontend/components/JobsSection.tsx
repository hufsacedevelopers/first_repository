import JobCard from "@/components/JobCard";
import Link from "next/link";
import { Job } from "@/types";

interface JobsSectionProps {
  jobs: Job[];
  /** 홈 미리보기: 헤더 생략, 카드 개수 제한·하단 안내 링크 */
  variant?: "full" | "preview";
  previewLimit?: number;
}

export default function JobsSection({
  jobs,
  variant = "full",
  previewLimit = 2,
}: JobsSectionProps) {
  const list = variant === "preview" ? jobs.slice(0, previewLimit) : jobs;

  if (variant === "preview") {
    return (
      <div className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">미리보기</p>
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/recommendations"
            className="inline-flex items-center justify-center rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            추천 페이지로 이동 · 전체 검색
          </Link>
          <Link
            href="/recommendations"
            className="text-center text-sm font-semibold text-primary-800 underline-offset-4 hover:underline sm:text-left"
          >
            더 많은 일자리 보기 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section id="jobs" className="scroll-mt-20 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            Live Job Listings
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            지금 올라온 장애인 채용 공고
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            한국장애인고용공단 실시간 데이터 기준입니다.
            근무환경 지표(서기·시력·청력·중량물 등)를 분석해 접근성 점수를 산출합니다.
          </p>
        </div>
        <Link
          href="/recommendations"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          장애 유형별 필터 검색
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
