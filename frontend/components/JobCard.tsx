import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
      <p className="mt-1 text-sm text-slate-600">
        {job.companyName} | {job.location} | {job.employmentType}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.accessibilityTags.map((tag) => (
          <span
            key={`${job.title}-${tag}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
