import CompanyListSection from "@/components/CompanyListSection";
import CompaniesSearchBar from "@/components/CompaniesSearchBar";
import { filterCompaniesByQuery } from "@/lib/companies-search";
import { getCompaniesWithMeta, isDevCompanyDemoMode } from "@/lib/data";
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

  const filtered = q ? filterCompaniesByQuery(result.companies, q) : result.companies;

  /** 배포 사이트에서는 폴백 정적 목록일 때 '정적 데이터 · 검색' 칩을 숨김 */
  const hideSourceBadge = !isDev && Boolean(q) && result.source === "static";

  let badgeLabel: string | undefined;
  if (isDev) badgeLabel = "데모 데이터";
  else if (!q) badgeLabel = "기업명 검색 시 표시";
  else if (result.source === "live") badgeLabel = "실시간 데이터 · 검색";
  else if (!hideSourceBadge) badgeLabel = "정적 데이터 · 검색";

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
            다른 키워드를 시도해 보거나, 서버에서 내려주는 일부 기업 목록 범위 안에서만 일치합니다.
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
          hideSourceBadge={hideSourceBadge}
          emptyState={emptyState ?? undefined}
        />
      </main>
    </div>
  );
}
