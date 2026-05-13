import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 — ChoiceWork",
  description:
    "ChoiceWork 개인정보처리방침. 개인정보 보호법 준수 및 수집·이용·파기 안내.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page">
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-10 md:px-8 md:pt-12">
        <Link
          href="/"
          className="text-sm text-slate-500 transition hover:text-slate-800"
        >
          ← 홈으로
        </Link>

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          ChoiceWork 개인정보처리방침
        </h1>
        <p className="mt-3 text-sm text-slate-500">시행일: 2026년 5월 13일</p>

        <p className="mt-8 text-sm leading-relaxed text-slate-700 md:text-[15px]">
          ChoiceWork는 「개인정보 보호법」에 따라 이용자의 개인정보를 안전하게 처리합니다.
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-700 md:text-[15px]">
          <section>
            <h2 className="text-base font-bold text-slate-900">제1조 (수집하는 개인정보)</h2>
            <p className="mt-3">서비스는 다음 정보를 수집할 수 있습니다.</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>회원가입 시: 이메일 주소, 비밀번호(암호화 저장)</li>
              <li>서비스 이용 시: 관심 공고, 최근 조회 내역, 추천 기록</li>
              <li>자동 수집 정보: 접속 로그, 브라우저 정보</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제2조 (개인정보 이용 목적)</h2>
            <p className="mt-3">수집한 개인정보는 다음 목적으로 사용됩니다.</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>회원 식별 및 로그인</li>
              <li>관심 공고 및 개인화 기능 제공</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>문의 대응</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제3조 (개인정보의 제3자 제공)</h2>
            <p className="mt-3">
              운영자는 원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 법령에 따라 요구되는
              경우는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제4조 (개인정보 보관 및 파기)</h2>
            <p className="mt-3">
              회원 탈퇴 시 관련 법령에 따라 필요한 경우를 제외하고 개인정보를 지체 없이 삭제합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제5조 (안전성 확보 조치)</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>비밀번호 암호화 저장</li>
              <li>접근 통제</li>
              <li>최소한의 개인정보 수집</li>
              <li>정기적인 보안 점검</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제6조 (이용자의 권리)</h2>
            <p className="mt-3">
              이용자는 자신의 개인정보에 대해 조회, 수정, 삭제를 요청할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제7조 (문의처)</h2>
            <ul className="mt-3 list-none space-y-2 pl-0">
              <li>운영자: HUFS ACE Developers</li>
              <li>
                이메일:{" "}
                <a
                  href="mailto:contact@choicework.kr"
                  className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-900"
                >
                  contact@choicework.kr
                </a>{" "}
                (예시)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900">제8조 (방침 변경)</h2>
            <p className="mt-3">
              본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지합니다.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
