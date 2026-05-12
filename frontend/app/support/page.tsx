import SupportSection from "@/components/SupportSection";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-6xl space-y-8 px-6 pb-16 pt-8">
        <SupportSection />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">경기도 장애인활동 지원 기관 찾기</h2>
          <p className="mt-2 text-sm text-slate-600">
            시·군을 고르고 기관 목록·주소·연락처를 확인합니다. 경기도에서 공개하는 기관 정보와 연결되어 있습니다.
          </p>
          <Link
            href="/support/gyeonggi-activity-support"
            className="mt-5 inline-flex items-center justify-center rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-primary-100"
          >
            경기도 활동지원 기관 보기
          </Link>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">공단 상담/신청은 별도 페이지에서 진행</h2>
          <p className="mt-2 text-sm text-slate-600">
            지원금 계산과 공식 안내 링크를 분리해, 절차를 한 화면에서 단계별로 확인할 수 있게 구성했습니다.
          </p>
          <Link
            href="/support/consulting"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            공단 상담/신청 페이지로 이동
          </Link>
        </section>
      </main>
    </div>
  );
}
