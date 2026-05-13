// frontend/components/SiteFooter.tsx

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white pb-12 pt-16 mt-auto">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* 네비게이터 메뉴 (4열 구조) */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">ChoiceWork</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900">서비스 소개</Link></li>
              <li><Link href="/features" className="hover:text-slate-900">핵심 기능</Link></li>
              <li><Link href="/guide" className="hover:text-slate-900">이용 가이드</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">탐색</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/recommendations" className="hover:text-slate-900">일자리 맞춤 추천</Link></li>
              <li><Link href="/saved-jobs" className="hover:text-slate-900">관심 공고</Link></li>
              <li><Link href="/support" className="hover:text-slate-900">경기도 지원금 안내</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">관련 기관</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="https://www.kead.or.kr" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">한국장애인고용공단 ↗</a></li>
              <li><a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">공공데이터포털 ↗</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold text-slate-900">문의</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><span className="cursor-pointer hover:text-slate-900">고객센터</span></li>
              <li><span className="cursor-pointer hover:text-slate-900">제휴 문의</span></li>
            </ul>
          </div>
        </div>

        {/* 하단 프로젝트 및 사업자 정보 영역 */}
        <div className="mt-12 border-t border-slate-100 pt-8 text-xs text-slate-500">
          <p className="mb-2 font-bold text-slate-700">ChoiceWork 프로젝트</p>
          <p className="mb-1">공공데이터포털·한국장애인고용공단 정보 연계 · 장애인 취업 의사결정 MVP</p>
          <p className="mb-4">개발: HUFS ACE Developers</p>
          
          <div className="flex flex-wrap gap-4 font-semibold text-slate-600">
            <span className="cursor-pointer hover:text-slate-900">이용약관</span>
            <span className="cursor-pointer hover:text-slate-900 text-slate-900">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-slate-900">운영정책</span>
          </div>
        </div>
      </div>
    </footer>
  );
}