import { Company } from "@/types";
import Link from "next/link";

import BookmarkButton from "./BookmarkButton";
import ScoreTooltip from "./ScoreTooltip";

interface CompanyScoreCardProps {
  company: Company;
}

function SubScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold tabular-nums text-slate-900">{score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
}

export default function CompanyScoreCard({ company }: CompanyScoreCardProps) {
  const empCount = company.disabledEmployedCount != null ? `(${company.disabledEmployedCount}명 고용)` : "";
  const sub = company.subScores;

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100/80">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-700">Company Rating</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{company.companyName}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {company.industry ?? company.location}
            {company.industry ? ` · ${company.location}` : null}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-start justify-end gap-1">
            <p className="text-3xl font-bold tabular-nums text-primary-800">
              {company.friendlinessScore}
              <span className="text-lg font-semibold text-slate-500">/100</span>
            </p>
            <div className="pt-1">
              <ScoreTooltip ariaLabel="장애 친화도 점수 안내" />
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500">장애 친화도 점수</p>
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        평가 근거 데이터
      </p>
      <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">장애인 고용률</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {company.disabledEmploymentRate}%{" "}
            <span className="font-normal text-slate-600">{empCount}</span>
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">접근성 등급</dt>
          <dd className="mt-1 font-semibold text-slate-900">{company.accessibilityGrade ?? "—"}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 md:col-span-2">
          <dt className="text-xs text-slate-500">표준사업장 인증</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {company.standardWorkplaceCertified === true
              ? "✓ 표준사업장 인증"
              : company.standardWorkplaceCertified === false
                ? "표준사업장 미인증"
                : "—"}
          </dd>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 md:col-span-2">
          <dt className="text-xs text-emerald-800">채용 시 지원금 (참고)</dt>
          <dd className="mt-1 font-semibold text-emerald-950">
            {company.monthlySupportLabel ?? "—"}{" "}
            <span className="font-normal text-emerald-800">
              · {company.annualSupportLabel ?? ""}
            </span>
          </dd>
        </div>
      </dl>

      {sub && (
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold text-slate-600">세부 평가 지표</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SubScoreBar label="접근성" score={sub.accessibility} />
            <SubScoreBar label="고용" score={sub.employment} />
            <SubScoreBar label="복지" score={sub.welfare} />
            <SubScoreBar label="문화" score={sub.culture} />
          </div>
        </div>
      )}

      {!sub && (
        <dl className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm md:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">근속률</dt>
            <dd className="font-semibold">{company.retentionRate}%</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">직무 다양성</dt>
            <dd className="font-semibold">{company.jobDiversity}점</dd>
          </div>
        </dl>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
        <Link
          href={`/company/${company.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          기업 상세 보기
        </Link>
        <BookmarkButton storageKey={`company-${company.id}`} label="관심" />
      </div>
    </article>
  );
}
