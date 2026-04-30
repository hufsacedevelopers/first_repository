import JobCard from "@/components/JobCard";
import Link from "next/link";
import { Job } from "@/types";

interface JobsSectionProps {
  jobs: Job[];
}

export default function JobsSection({ jobs }: JobsSectionProps) {
  return (
    <section id="jobs" className="scroll-mt-20 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            AI Recommendations
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            당신에게 맞는 일자리를 찾아드립니다
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            AI가 당신의 역량, 선호도, 필요 조건을 분석하여 가장 적합한 일자리를 추천합니다.
          </p>
        </div>
        <Link
          href="/recommendations"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          더 많은 일자리 보기
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
