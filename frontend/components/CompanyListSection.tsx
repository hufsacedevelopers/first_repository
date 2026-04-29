import CompanyScoreCard from "@/components/CompanyScoreCard";
import MethodologyBlock from "@/components/MethodologyBlock";
import { Company } from "@/types";

interface CompanyListSectionProps {
  companies: Company[];
}

export default function CompanyListSection({ companies }: CompanyListSectionProps) {
  return (
    <section id="companies" className="scroll-mt-20 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            Company Rating
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            기업별 장애 친화도 정량 평가 및 비교
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            15개 공공데이터 지표를 종합하여 0–100점 척도로 평가합니다. 고용률, 접근성 등급, 지원금
            정보를 투명하게 공개합니다.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-900">
          기업 비교 모드
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {companies.map((company) => (
          <CompanyScoreCard key={company.companyName} company={company} />
        ))}
      </div>

      <MethodologyBlock />
    </section>
  );
}
