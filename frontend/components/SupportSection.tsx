"use client";

import { useMemo, useState } from "react";

const programs = [
  {
    title: "장애인 고용장려금",
    summary: "월 최대 80만원까지 고용장려금 지원",
    target: "중증장애인 채용 기업",
    amount: "최대 960만원/년"
  },
  {
    title: "근로지원인 서비스",
    summary: "직무 수행을 위한 근로지원인 지원",
    target: "중증장애인 근로자",
    amount: "월 160시간"
  },
  {
    title: "보조공학기기 지원",
    summary: "업무 수행에 필요한 보조공학기기 지원",
    target: "장애인 근로자",
    amount: "최대 3,000만원"
  },
  {
    title: "직업능력개발 훈련",
    summary: "직무 역량 향상을 위한 교육훈련 지원",
    target: "장애인 구직자",
    amount: "전액 무료"
  }
];

export default function SupportSection() {
  const [employmentType, setEmploymentType] = useState<"정규직" | "계약직">("정규직");
  const [disabilityLevel, setDisabilityLevel] = useState<"중증" | "경증">("중증");
  const [headcount, setHeadcount] = useState(1);

  const { annualMan, monthlyMan } = useMemo(() => {
    const baseMonthly = disabilityLevel === "중증" ? 80 : 60;
    const adjusted =
      employmentType === "계약직" ? Math.round(baseMonthly * 0.9) : baseMonthly;
    const perPersonMonthly = adjusted;
    const perPersonAnnual = perPersonMonthly * 12;
    return {
      monthlyMan: perPersonMonthly * headcount,
      annualMan: perPersonAnnual * headcount
    };
  }, [employmentType, disabilityLevel, headcount]);

  return (
    <section id="support" className="scroll-mt-20 space-y-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          Support Programs
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          지원금 계산기 · 얼마를 받을 수 있나요?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          채용 조건을 입력하면 받을 수 있는 정부 지원금을 간단히 산출해 참고할 수 있습니다. (실제
          금액은 신청 조건 및 시행 규정에 따릅니다.)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {programs.map((p) => (
          <article
            key={p.title}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-bold text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{p.summary}</p>
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div>
                <dt className="text-xs text-slate-500">지원 대상</dt>
                <dd className="font-medium text-slate-800">{p.target}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">지원 금액</dt>
                <dd className="font-semibold text-primary-800">{p.amount}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">예상 지원금 계산하기</h3>
        <p className="mt-2 text-sm text-slate-600">
          채용 조건을 선택하면 1인 기준 예상 지원금을 표시합니다.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">고용 형태</legend>
              <div className="mt-2 flex gap-2">
                {(["정규직", "계약직"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEmploymentType(t)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      employmentType === t
                        ? "bg-primary-700 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">장애 등급</legend>
              <div className="mt-2 flex gap-2">
                {(["중증", "경증"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDisabilityLevel(t)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                      disabilityLevel === t
                        ? "bg-primary-700 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="headcount" className="text-sm font-medium text-slate-700">
                채용 인원
              </label>
              <input
                id="headcount"
                type="number"
                min={1}
                max={99}
                value={headcount}
                onChange={(e) => setHeadcount(Math.max(1, Number(e.target.value) || 1))}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-primary-100 bg-primary-50/50 p-6">
            <p className="text-sm font-medium text-slate-600">예상 지원금 (1인 기준)</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-primary-900">
              {annualMan}만원<span className="text-lg font-semibold text-slate-600">/년</span>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              월 지원금 <span className="font-semibold text-slate-900">{monthlyMan}만원</span>
            </p>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              본 계산은 데모용 단순 모델입니다. 실제 지원 여부·금액은 관계 기관 기준을 확인하세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
