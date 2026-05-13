import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white pb-10 pt-14">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* 브랜드 · 한 줄 소개 */}
          <div className="sm:col-span-2 lg:col-span-1 lg:max-w-sm">
            <p className="text-lg font-bold tracking-tight text-slate-900">ChoiceWork</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              공공데이터와 AI를 활용해
              <br />
              더 나은 일자리를 선택하도록 돕는 취업 의사결정 플랫폼
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">탐색</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/recommendations" className="transition hover:text-slate-900">
                  일자리 맞춤 추천
                </Link>
              </li>
              <li>
                <Link href="/saved-jobs" className="transition hover:text-slate-900">
                  관심 공고
                </Link>
              </li>
              <li>
                <Link
                  href="/support/gyeonggi-activity-support"
                  className="transition hover:text-slate-900"
                >
                  경기도 지원기관 안내
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">관련 기관</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a
                  href="https://www.kead.or.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-slate-900"
                >
                  한국장애인고용공단
                </a>
              </li>
              <li>
                <a
                  href="https://www.data.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-slate-900"
                >
                  공공데이터포털
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">문의</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <span className="cursor-default text-slate-600">고객센터</span>
              </li>
              <li>
                <span className="cursor-default text-slate-600">제휴 문의</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
            <Link href="/terms" className="font-medium transition hover:text-slate-900">
              이용약관
            </Link>
            <span className="text-slate-300" aria-hidden>
              |
            </span>
            <Link href="/privacy" className="font-medium transition hover:text-slate-900">
              개인정보처리방침
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            © 2026 ChoiceWork. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
