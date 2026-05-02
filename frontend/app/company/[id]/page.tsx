import ScoreTooltip from "@/components/ScoreTooltip";
import SiteHeader from "@/components/SiteHeader";
import BookmarkButton from "@/components/BookmarkButton";
import { getCompanyById } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

function ScoreBar({ label, score, color = "bg-primary-500" }: { label: string; score: number; color?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-lg font-bold tabular-nums text-slate-900">{score}<span className="text-xs font-normal text-slate-400">/100</span></span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 90) return <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">최우수</span>;
  if (score >= 80) return <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-bold text-primary-800">우수</span>;
  if (score >= 70) return <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">양호</span>;
  return <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">보통</span>;
}

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const company = await getCompanyById(id);
  if (!company) return notFound();

  const sub = company.subScores;

  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 pb-16 pt-8">
        {/* 뒤로가기 */}
        <Link
          href="/#companies"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
        >
          ← 기업 목록으로
        </Link>

        {/* 기업 헤더 */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Company Rating</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{company.companyName}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {company.industry ?? ""}
                {company.industry && company.location ? " · " : ""}
                {company.location}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <div className="flex items-start justify-end gap-1">
                  <p className="text-4xl font-bold tabular-nums text-primary-800">
                    {company.friendlinessScore}
                    <span className="text-xl font-semibold text-slate-400">/100</span>
                  </p>
                  <div className="pt-1">
                    <ScoreTooltip ariaLabel="장애 친화도 점수 안내" />
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-500">장애 친화도 점수</p>
              </div>
              <ScoreBadge score={company.friendlinessScore} />
            </div>
          </div>

          {/* 표준사업장 인증 배지 */}
          {company.standardWorkplaceCertified && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <span className="text-emerald-600">✓</span>
              <span className="text-sm font-semibold text-emerald-800">표준사업장 인증 기업</span>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <BookmarkButton storageKey={`company-${company.id}`} label="관심 기업 등록" />
          </div>
        </div>

        {/* 세부 지표 */}
        {sub && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Detailed Scores</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">세부 평가 지표</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <ScoreBar label="접근성" score={sub.accessibility} color="bg-blue-500" />
              <ScoreBar label="고용" score={sub.employment} color="bg-primary-500" />
              <ScoreBar label="복지" score={sub.welfare} color="bg-emerald-500" />
              <ScoreBar label="문화" score={sub.culture} color="bg-violet-500" />
            </div>
          </section>
        )}

        {/* 고용 현황 */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Employment Data</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">장애인 고용 현황</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <dt className="text-xs text-slate-500">장애인 고용률</dt>
              <dd className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                {company.disabledEmploymentRate}%
              </dd>
              <dd className="mt-1 text-xs text-slate-500">법정 의무(3.1%) 기준</dd>
            </div>
            {company.disabledEmployedCount != null && (
              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <dt className="text-xs text-slate-500">장애인 고용 인원</dt>
                <dd className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                  {company.disabledEmployedCount}명
                </dd>
              </div>
            )}
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <dt className="text-xs text-slate-500">근속률</dt>
              <dd className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                {company.retentionRate}%
              </dd>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <dt className="text-xs text-slate-500">직무 다양성</dt>
              <dd className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                {company.jobDiversity}점
              </dd>
            </div>
            {company.accessibilityGrade && (
              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <dt className="text-xs text-slate-500">접근성 등급</dt>
                <dd className="mt-2 text-2xl font-bold text-slate-900">{company.accessibilityGrade}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* 생활 접근성 점수 */}
        {company.accessibilityScore != null && (
          <section className="mt-6 rounded-3xl border border-blue-200 bg-blue-50/40 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Life Accessibility
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">생활 접근성</h2>
            <p className="mt-1 text-sm text-slate-500">
              경기도 장애인활동지원 기관 분포를 기반으로 산출한 지역 생활 접근성 지표입니다.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center">
                <p className="text-xs text-blue-600">생활 접근성 점수</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-blue-900">
                  {Math.round(company.accessibilityScore * 100)}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">활동지원 기관 밀도 기준</p>
              </div>
              {company.compositeScore != null && (
                <div className="rounded-2xl border border-primary-100 bg-white p-5 text-center">
                  <p className="text-xs text-primary-700">종합 점수</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-primary-900">
                    {company.compositeScore}
                    <span className="text-sm font-normal text-slate-400">/100</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">고용 70% + 생활 30%</p>
                </div>
              )}
              <div className="flex flex-col justify-center rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-medium text-slate-500">종합 점수 산출 방식</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  <li>· 기업 친화도 점수 × 0.7</li>
                  <li>· 생활 접근성 점수 × 0.3</li>
                  <li className="mt-2 text-slate-400">
                    활동지원기관이 많은 지역일수록<br />생활 접근성이 높습니다.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 지원금 안내 */}
        {(company.monthlySupportLabel || company.annualSupportLabel) && (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Support Grant</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">채용 시 지원금</h2>
            <p className="mt-1 text-sm text-slate-500">이 기업에 취업 시 받을 수 있는 예상 지원금입니다.</p>
            <div className="mt-5 flex flex-wrap gap-4">
              {company.monthlySupportLabel && (
                <div className="rounded-2xl border border-emerald-200 bg-white px-6 py-4 text-center">
                  <p className="text-xs text-emerald-700">월 지원금</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-900">{company.monthlySupportLabel}</p>
                </div>
              )}
              {company.annualSupportLabel && (
                <div className="rounded-2xl border border-emerald-200 bg-white px-6 py-4 text-center">
                  <p className="text-xs text-emerald-700">연간 최대</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-900">{company.annualSupportLabel}</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              * 실제 지원금은 장애 정도, 고용형태, 기업 규모에 따라 달라질 수 있습니다.
            </p>
          </section>
        )}

        {/* 하단 CTA */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/recommendations"
            className="rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
          >
            이 기업의 채용공고 찾기
          </Link>
          <Link
            href="/#support"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            지원금 계산하기
          </Link>
        </div>
      </main>
    </div>
  );
}
