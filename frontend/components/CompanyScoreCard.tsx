import { Company } from "@/types";

interface CompanyScoreCardProps {
  company: Company;
}

export default function CompanyScoreCard({ company }: CompanyScoreCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{company.companyName}</h3>
          <p className="text-sm text-slate-600">{company.location}</p>
        </div>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
          점수 {company.friendlinessScore}
        </span>
      </div>
      <div className="space-y-2 text-sm text-slate-700">
        <p>장애인 고용률: {company.disabledEmploymentRate}%</p>
        <p>근속률: {company.retentionRate}%</p>
        <p>직무 다양성: {company.jobDiversity}점</p>
      </div>
    </article>
  );
}
