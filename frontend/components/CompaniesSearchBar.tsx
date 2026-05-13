"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompaniesSearchBar({
  initialQuery,
  isDev,
}: {
  initialQuery: string;
  isDev: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/companies?q=${encodeURIComponent(q)}` : "/companies");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="company-q" className="block text-sm font-medium text-slate-700">
            기업명 검색
          </label>
          <input
            id="company-q"
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="예: 삼성, 네이버, 현대"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none ring-primary-500/30 transition focus:border-primary-400 focus:ring-2"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800"
        >
          검색
        </button>
      </form>
      {isDev ? (
        <p className="mt-3 text-xs text-amber-800">
          로컬 개발 모드: 기업 카드·방법론은 더미입니다. 실제 API로 보려면{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-[11px]">NEXT_PUBLIC_USE_LIVE_COMPANY_API=true</code>{" "}
          를 설정하세요.
        </p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          검색 시 장애 유형별 일자리 검색과 동일한 구인 공고에서 추린 기업명에 대해, 백엔드 친화도 데이터가
          있으면 우선 표시하고 없으면 공고 근무환경 점수로 추정합니다.
        </p>
      )}
    </div>
  );
}
