import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const score = job.friendlinessScore;
  const match = job.matchPercent;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/80 transition hover:border-primary-200 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-700">{job.companyName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {score != null && (
            <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800">
              친화도 {score}점
            </span>
          )}
          {match != null && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
              {match}% 매칭
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600">{job.location}</p>
      <p className="text-sm text-slate-600">
        <span className="font-medium text-slate-800">{job.employmentType}</span>
        {job.salaryRange ? ` · ${job.salaryRange}` : null}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.accessibilityTags.map((tag) => (
          <span
            key={`${job.title}-${tag}`}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {(job.monthlySupportLabel || job.annualSupportLabel) && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm">
          <span className="text-slate-500">채용 시 지원금 </span>
          <span className="font-semibold text-slate-900">
            {job.monthlySupportLabel}
            {job.annualSupportLabel ? ` ${job.annualSupportLabel}` : ""}
          </span>
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          자세히 보기
        </button>
      </div>
    </article>
  );
}
