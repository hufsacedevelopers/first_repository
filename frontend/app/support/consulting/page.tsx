import SiteHeader from "@/components/SiteHeader";

const CONSULTING_STEPS = [
  {
    title: "1) 제도 확인",
    description: "사업장/구직자 기준으로 어떤 지원사업이 적용되는지 먼저 확인합니다.",
    actionLabel: "공단 서비스 안내",
    href: "https://www.kead.or.kr/view/service/service01.jsp",
  },
  {
    title: "2) 신청 준비",
    description: "고용장려금·근로지원인·보조공학기기 등 유형별 신청 요건과 준비 서류를 확인합니다.",
    actionLabel: "고용장려금 신청 안내",
    href: "https://www.kead.or.kr/view/service/service02_04_01.jsp",
  },
  {
    title: "3) 상담 연결",
    description: "지역 지사/담당 채널을 통해 실제 신청 전에 적합 유형을 상담받는 흐름을 권장합니다.",
    actionLabel: "대표 서비스 포털",
    href: "https://www.kead.or.kr/",
  },
] as const;

export default function SupportConsultingPage() {
  return (
    <div className="min-h-screen bg-page">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">KEAD Support</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">공단 상담/신청 바로가기</h1>
          <p className="mt-3 text-sm text-slate-600">
            유형별 지원사업은 한국장애인고용공단 공식 페이지에서 최신 기준으로 확인할 수 있습니다.
          </p>
        </section>

        <section className="mt-8 space-y-4">
          {CONSULTING_STEPS.map((step) => (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              <a
                href={step.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {step.actionLabel}
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
