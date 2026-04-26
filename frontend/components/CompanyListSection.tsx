import CompanyScoreCard from "@/components/CompanyScoreCard";
import { Company } from "@/types";

interface CompanyListSectionProps {
  companies: Company[];
}

export default function CompanyListSection({ companies }: CompanyListSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">기업 리스트</h2>
        <p className="mt-1 text-sm text-slate-600">
          장애 친화도 점수를 기준으로 현재 확인 가능한 기업 목록입니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <CompanyScoreCard key={company.companyName} company={company} />
        ))}
      </div>
    </section>
  );
}
