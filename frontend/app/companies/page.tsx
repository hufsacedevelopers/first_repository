import CompanyListSection from "@/components/CompanyListSection";
import CompaniesSearchBar from "@/components/CompaniesSearchBar";
import { mergeCompaniesForJobPoolSearch } from "@/lib/companies-job-pool";
import { getCompaniesWithMeta, getJobs, isDevCompanyDemoMode } from "@/lib/data";
import type { ReactNode } from "react";
import type { Company } from "@/types";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function CompaniesPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const isDev = isDevCompanyDemoMode();

  /** 프로덕션: 검색어 없으면 목록 API를 호출하지 않음. 로컬 데모 모드는 항상 더미 목록 사용 */
  const skipCompanyFetch = !isDev && !q;

  const result = skipCompanyFetch
    ? {
        source: "live" as const,
        syncedAt: null as string | null,
        companies: [] as Company[],
      }
    : await getCompaniesWithMeta();

  /** 일자리 검색(`getJobs`)과 동일한 공고 풀에서 기업명을 모아 API·추정 친화도 병합 */
  const filtered = q
    ? mergeCompaniesForJobPoolSearch(q, await getJobs(400), result.companies)
    : result.companies;

  let badgeLabel: string | undefined;
  if (isDev) badgeLabel = "데모 데이터";
  else if (!q) badgeLabel = "기업명 검색 시 표시";
  else if (result.source === "live") badgeLabel = "실시간 · 일자리 공고 동일 기업 풀";
  else badgeLabel = "일자리 공고 기반 · 친화도 비교";

  let emptyState: ReactNode | null;
  if (filtered.length === 0) {
    if (!isDev && !q) {
      emptyState = (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center">
          <p className="font-semibold text-slate-900">기업명을 검색해 보세요</p>
          <p className="mt-2 text-sm text-slate-600">
            배포 환경에서는 공공데이터 기반 친화도·고용 정보가 검색한 기업에 한해 표시됩니다.
          </p>
        </div>
      );
    } else if (q) {
      emptyState = (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center">
          <p className="font-semibold text-slate-900">검색 결과가 없습니다</p>
          <p className="mt-2 text-sm text-slate-600">
            장애 유형별 일자리 검색에 노출되는 공고의 기업명과 같은 범위에서 찾습니다. 다른 키워드로
            시도해 보세요.
          </p>
        </div>
      );
    } else {
      emptyState = null;
    }
  } else {
    emptyState = null;
  }

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl space-y-8 px-6 pb-16 pt-8">
        <CompaniesSearchBar key={q} initialQuery={q} isDev={isDev} />
        <CompanyListSection
          companies={filtered}
          source={result.source}
          syncedAt={result.syncedAt}
          badgeLabel={badgeLabel}
          emptyState={emptyState ?? undefined}
        />
      </main>
    </div>
  );
}
