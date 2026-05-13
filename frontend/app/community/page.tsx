// frontend/app/community/page.tsx

import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12">
      {/* 헤더 영역 */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">ChoiceWork 커뮤니티</h1>
        <p className="text-lg text-slate-600">
          비슷한 고민을 가진 이웃들과 정보를 나누고, 동네 소모임에 참여해 보세요.
        </p>
      </div>

      {/* 게시판 카테고리 (2단 분할) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. 장애 유형별 소통 공간 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">🗣️ 장애 유형별 소통</h2>
            <button className="text-sm text-slate-500 hover:text-slate-900">더보기</button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 pb-4 border-b border-slate-100">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md h-fit whitespace-nowrap">지체</span>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1 cursor-pointer hover:underline">판교역 주변 휠체어 접근성 좋은 식당 리스트 공유합니다!</p>
                <p className="text-xs text-slate-500">방금 전 · 💬 12</p>
              </div>
            </div>
            <div className="flex gap-3 pb-4 border-b border-slate-100">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-md h-fit whitespace-nowrap">시각</span>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1 cursor-pointer hover:underline">화면 낭독기(센스리더) 호환성 좋은 사무 보조 직무 후기</p>
                <p className="text-xs text-slate-500">2시간 전 · 💬 8</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md h-fit whitespace-nowrap">청각</span>
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1 cursor-pointer hover:underline">수어 통역 지원되는 직무 교육 프로그램 모집한대요</p>
                <p className="text-xs text-slate-500">어제 · 💬 24</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 동네 소모임 공간 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">🤝 우리 동네 소모임</h2>
            <button className="text-sm text-slate-500 hover:text-slate-900">더보기</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600">모집중</span>
                <span className="text-xs text-slate-500">성남시 분당구</span>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-2">탄천 무장애길 휠체어 가벼운 산책 모임 🌳</p>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>이번 주 토요일 오후 2시</span>
                <span>참여 4/6명</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">마감임박</span>
                <span className="text-xs text-slate-500">수원시 영통구</span>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-2">조용한 카페에서 이력서 자소서 함께 써요 ✍️</p>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>내일 오후 7시</span>
                <span>참여 3/4명</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}