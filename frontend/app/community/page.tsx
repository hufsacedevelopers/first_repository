// frontend/app/community/page.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, TrendingUp, User, Search, ArrowLeft } from "lucide-react";

// 1. 임시 데이터 (초기 상태용)
const initialPosts = [
  { id: 1, board: "청각장애 게시판", title: "수어 통역사 동반 가능한 면접 후기 공유합니다", content: "이번에 IT 기업 면접을 봤는데, 수어 통역사 대동이 가능했습니다. 면접관분들도 시선 처리를 통역사가 아닌 저에게 맞춰주셔서 정말 편안하게 볼 수 있었어요! 다른 분들도 참고하세요.", author: "익명", time: "10분 전", likes: 12, comments: [{ id: 1, author: "익명1", text: "오 좋은 정보 감사합니다!", time: "5분 전" }] },
  { id: 2, board: "지체장애 게시판", title: "판교역 4번 출구 쪽 턱 없는 카페 찾았어요!", content: "출퇴근길에 들르기 좋은 카페인데, 입구에 경사로가 완만하게 잘 되어 있고 내부 테이블 간격도 넓어서 전동 휠체어 들어가기 아주 수월합니다.", author: "익명", time: "1시간 전", likes: 24, comments: [{ id: 1, author: "운영자", text: "지도에도 핀 추가해두면 좋겠네요!", time: "30분 전" }] },
  { id: 3, board: "취업정보", title: "공단에서 실시하는 이번 달 직무 교육 리스트", content: "웹 접근성 품질인증 심사원 양성 과정 모집이 떴습니다. 관심 있으신 분들 공단 홈페이지 확인해보세요.", author: "운영자", time: "3시간 전", likes: 45, comments: [] },
  { id: 4, board: "자유게시판", title: "첫 출근인데 너무 떨리네요.. 다들 응원 한 번씩만!", content: "1일 체험으로 갔던 회사에서 정식으로 일하게 되었습니다. 내일이 첫 출근인데 실수할까봐 너무 긴장되네요 ㅠㅠ", author: "익명", time: "5시간 전", likes: 89, comments: [{ id: 1, author: "익명2", text: "축하드립니다!! 처음엔 다 실수하면서 배우는 거죠 화이팅!", time: "4시간 전" }, { id: 2, author: "익명3", text: "자신감 가지세요 응원합니다!", time: "1시간 전" }] },
  { id: 5, board: "동네 소모임", title: "이번 주 토요일 탄천 무장애길 산책 가실 분?", content: "날씨도 좋은데 가볍게 산책하고 커피 한잔 할 동네 주민 구합니다~ 현재 2명 모였어요.", author: "익명", time: "하루 전", likes: 15, comments: [] },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [activeBoard, setActiveBoard] = useState("전체보기");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoaded, setIsLoaded] = useState(false); // 로컬 스토리지 로딩 상태 확인

  const boardCategories = ["전체보기", "자유게시판", "취업정보", "청각장애 게시판", "시각장애 게시판", "지체장애 게시판", "발달장애 게시판", "동네 소모임"];

  // 2. 화면이 처음 켜질 때 로컬 스토리지에서 저장된 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem("choiceWorkCommunityData");
    if (savedData) {
      setPosts(JSON.parse(savedData));
    }
    setIsLoaded(true);
  }, []);

  // 3. 게시글(댓글 등)에 변화가 생길 때마다 로컬 스토리지에 자동 저장하기
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("choiceWorkCommunityData", JSON.stringify(posts));
    }
  }, [posts, isLoaded]);

  // 필터링 로직
  const filteredPosts = posts.filter(post => {
    const matchBoard = activeBoard === "전체보기" || post.board === activeBoard;
    const matchSearch = post.title.includes(searchQuery) || post.content.includes(searchQuery);
    return matchBoard && matchSearch;
  });

  const selectedPost = posts.find(p => p.id === selectedPostId);

  // 댓글 작성 핸들러
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPostId) return;
    
    setPosts(posts.map(post => {
      if (post.id === selectedPostId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), author: "나", text: newComment, time: "방금 전" }]
        };
      }
      return post;
    }));
    setNewComment("");
  };

  // 초기 렌더링 시 깜빡임 방지용 안전 장치
  if (!isLoaded) return null;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-12 gap-6">
        
        {/* 왼쪽: 게시판 사이드바 */}
        <aside className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 px-2">게시판 목록</h3>
            <nav className="space-y-1">
              {boardCategories.map((menu) => (
                <button 
                  key={menu} 
                  onClick={() => { setActiveBoard(menu); setSelectedPostId(null); setSearchQuery(""); }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition ${activeBoard === menu ? "bg-emerald-50 text-emerald-600 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`}
                >
                  {menu}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 중앙: 메인 영역 */}
        <main className="col-span-12 md:col-span-6 space-y-4">
          
          {selectedPostId && selectedPost ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setSelectedPostId(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm font-medium">
                <ArrowLeft size={16} /> 목록으로 돌아가기
              </button>
              
              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase mb-3 inline-block">{selectedPost.board}</span>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedPost.title}</h2>
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <div className="flex items-center gap-1"><User size={16} /> {selectedPost.author}</div>
                  <div>{selectedPost.time}</div>
                </div>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-8">{selectedPost.content}</p>
              
              <div className="flex gap-4 mb-8">
                <button className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-rose-100"><ThumbsUp size={16} /> 공감 {selectedPost.likes}</button>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-4">댓글 {selectedPost.comments.length}</h3>
                <div className="space-y-4 mb-6">
                  {selectedPost.comments.map(c => (
                    <div key={c.id} className="bg-slate-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-slate-800">{c.author}</span>
                        <span className="text-xs text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-sm text-slate-700">{c.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="댓글을 남겨보세요." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button onClick={handleAddComment} className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-600 transition">등록</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-2">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="이웃과 나누고 싶은 이야기를 검색해 보세요." 
                  className="w-full bg-transparent border-none text-sm focus:outline-none py-2"
                />
              </div>

              <div className="space-y-3">
                <div className="px-2 py-1 mb-2 font-bold text-slate-800">{activeBoard} <span className="text-emerald-500">{filteredPosts.length}</span></div>
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">검색 결과가 없습니다.</div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} onClick={() => setSelectedPostId(post.id)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">{post.board}</span>
                        <span className="text-xs text-slate-400">{post.time}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{post.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-1 mb-3">{post.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-slate-400 text-xs"><User size={14} /><span>{post.author}</span></div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <div className="flex items-center gap-1 text-xs"><ThumbsUp size={14} className="text-rose-500" /><span className="text-rose-500">{post.likes}</span></div>
                          <div className="flex items-center gap-1 text-xs"><MessageSquare size={14} className="text-blue-500" /><span className="text-blue-500">{post.comments.length}</span></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>

        {/* 오른쪽: HOT 게시물 */}
        <aside className="hidden md:block col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-rose-500" />
              <h3 className="font-bold text-slate-900">HOT 게시물</h3>
            </div>
            <div className="space-y-4">
              <div onClick={() => setSelectedPostId(4)} className="cursor-pointer group">
                <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 line-clamp-1">첫 출근인데 너무 떨리네요.. 다들 응원 한 번씩만!</p>
                <p className="text-[11px] text-slate-400 mt-1">공감 89 · 댓글 2</p>
              </div>
              <div onClick={() => setSelectedPostId(3)} className="cursor-pointer group">
                <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 line-clamp-1">공단에서 실시하는 이번 달 직무 교육 리스트</p>
                <p className="text-[11px] text-slate-400 mt-1">공감 45 · 댓글 0</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}