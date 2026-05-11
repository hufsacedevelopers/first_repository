import { Suspense } from "react";
import Link from "next/link";

import ActivitySupportInstitutionList from "@/components/gyeonggi/ActivitySupportInstitutionList";
import GyeonggiSigunFilter from "@/components/gyeonggi/GyeonggiSigunFilter";
import { getAccessibilityInstitutions, getAccessibilitySummary } from "@/lib/data";

interface PageProps {
  searchParams: Promise<{ sigunNm?: string }>;
}

export default async function GyeonggiActivitySupportPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedSigunNm = params.sigunNm?.trim() ?? "";

  const [summary, institutions] = await Promise.all([
    getAccessibilitySummary(),
    getAccessibilityInstitutions(selectedSigunNm || undefined),
  ]);

  const { regions, totalInstitutions, maxCount } = summary;
  const regionsSorted = [...regions].sort((a, b) => a.sigunNm.localeCompare(b.sigunNm, "ko"));

  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl space-y-8 px-6 pb-16 pt-8">
        <nav className="text-sm text-slate-500">
          <Link href="/support" className="font-medium text-primary-800 hover:underline">
            지원 안내
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-700">경기도 활동지원 기관</span>
        </nav>

        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
            경기도 공공데이터
          </p>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            시·군별 장애인활동 지원 기관 현황
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            데이터는 경기도 Open API{" "}
            <a
              href="https://openapi.gg.go.kr/Ggsigundspsnactsport"
              className="font-medium text-primary-800 underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ggsigundspsnactsport
            </a>
            를 통해 제공됩니다. 기관명·주소·연락처·급여 구분(활동보조·방문목욕·방문간호) 등을 확인할 수 있습니다.
          </p>
          <p className="text-xs text-slate-500">
            집계: 전체 {totalInstitutions}개 기관 · 시군 최다 기관 수 {maxCount}곳 (접근성 점수 산정 시 기준과 동일 출처)
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <Suspense
            fallback={
              <div className="h-24 animate-pulse rounded-xl bg-slate-100" aria-hidden="true" />
            }
          >
            <GyeonggiSigunFilter regions={regionsSorted} selectedSigunNm={selectedSigunNm} />
          </Suspense>
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">
              기관 목록{" "}
              <span className="text-base font-semibold text-slate-500">
                ({institutions.length}곳
                {selectedSigunNm ? ` · ${selectedSigunNm}` : ""})
              </span>
            </h2>
            <div className="mt-4">
              <ActivitySupportInstitutionList institutions={institutions} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
