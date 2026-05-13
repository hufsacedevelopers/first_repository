// frontend/app/community/page.tsx

import { MessageSquare, ThumbsUp, TrendingUp, User } from "lucide-react";

export default function CommunityPage() {
  // 예시 데이터: 실제 서비스 시에는 백엔드 API에서 가져오게 됩니다.
  const dummyPosts = [
    { id: 1, board: "청각장애", title: "수어 통역사 동반 가능한 면접 후기 공유합니다", author: "익명", time: "10분 전", likes: 12, comments: 5 },
    { id: 2, board: "지체장애", title: "판교역 4번 출구 쪽 턱 없는 카페 찾았어요!", author: "익명", time: "1시간 전", likes: 24, comments: 8 },
    { id: 3, board: "취업정보", title: "공단에서 실시하는 이번 달 직무 교육 리스트", author: "운영자", time: "3시간 전", likes: 45, comments: 12 },
    { id: 4, board: "자유게시판", title: "첫 출근인데 너무 떨리네요.. 다들 응원 한 번씩만!", author: "익명", time: "5시간 전", likes: 89, comments: 30 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-12 gap-6">
        
        {/* 1. 왼쪽: 게시판 사이드바 (에브리타임 스타일) */}
        <aside className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 px-2">게시판 목록</h3>
            <nav className="space-y-1">
              {["자유게시판", "취업정보", "청각장애 게시판", "시각장애 게시판", "지체장애 게시판", "발달장애 게시판", "동네 소모임"].map((menu) => (
                <button key={menu} className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition">
                  {menu}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 2. 중앙: 메인 피드 */}
        <main className="col-span-12 md:col-span-6 space-y-4">
          {/* 글쓰기 입력창 목업 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <input 
              type="text" 
              placeholder="이웃과 나누고 싶은 이야기를 적어보세요." 
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* 게시글 리스트 */}
          <div className="space-y-3">
            {dummyPosts.map((post) => (
              <div key={post.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 transition cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">{post.board}</span>
                  <span className="text-xs text-slate-400">{post.time}</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-3">{post.title}</h4>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <div className="flex items-center gap-1 text-xs">
                      <ThumbsUp size={14} className="text-rose-500" />
                      <span className="text-rose-500">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <MessageSquare size={14} className="text-blue-500" />
                      <span className="text-blue-500">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* 3. 오른쪽: HOT 게시물 & 실시간 인기글 */}
        <aside className="hidden md:block col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-rose-500" />
              <h3 className="font-bold text-slate-900">HOT 게시물</h3>
            </div>
            <div className="space-y-4">
              <div className="cursor-pointer group">
                <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 line-clamp-1">장애인 고용 장려금 신청 꿀팁 정리</p>
                <p className="text-[11px] text-slate-400 mt-1">공감 120 · 댓글 45</p>
              </div>
              <div className="cursor-pointer group">
                <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 line-clamp-1">이번에 새로 나온 보조공학기기 써보신 분?</p>
                <p className="text-[11px] text-slate-400 mt-1">공감 98 · 댓글 22</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}