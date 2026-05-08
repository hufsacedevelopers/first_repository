import CompanyScoreCard from "@/components/CompanyScoreCard";
import MethodologyBlock from "@/components/MethodologyBlock";
import Link from "next/link";
import { Company } from "@/types";

interface CompanyListSectionProps {
  companies: Company[];
  source?: "live" | "static";
  syncedAt?: string | null;
  variant?: "full" | "preview";
  previewLimit?: number;
}

export default function CompanyListSection({
  companies,
  source = "static",
  syncedAt = null,
  variant = "full",
  previewLimit = 2,
}: CompanyListSectionProps) {
  const list = variant === "preview" ? companies.slice(0, previewLimit) : companies;
  const firstId = companies[0]?.id;

  if (variant === "preview") {
    return (
      <div className="space-y-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">미리보기</p>
        <div id="companies" className="grid gap-6 scroll-mt-24 md:grid-cols-2">
          {list.map((company) => (
            <CompanyScoreCard key={company.companyName} company={company} />
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-500">
            카드를 눌러 표준사업장·고용 현황·지원금 예시를 상세 페이지에서 확인할 수 있습니다.
          </p>
          {firstId != null ? (
            <Link
              href={`/company/${firstId}`}
              className="inline-flex text-sm font-semibold text-primary-800 underline-offset-4 hover:underline"
            >
              기업 평가 더 보기 → 상세 예시
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

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
            장애인 고용률·접근성 등급·표준사업장 인증·복지 수준 등 공공데이터 기반 지표를 종합해
            0–100점으로 평가합니다.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-900">
          {source === "live" ? "실시간 데이터" : "정적 데이터"}
        </span>
      </div>
      {source === "live" && syncedAt ? (
        <p className="text-xs text-slate-500">
          최근 동기화: {new Date(syncedAt).toLocaleString("ko-KR")}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {list.map((company) => (
          <CompanyScoreCard key={company.companyName} company={company} />
        ))}
      </div>

      <MethodologyBlock />
    </section>
  );
}
