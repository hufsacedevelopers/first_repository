"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, TrendingUp, User, Search, ArrowLeft, PenLine, Check } from "lucide-react";

interface CommentData {
  id: number;
  author: string;
  text: string;
  time: string;
  /** 현재 기기에서 작성한 댓글(익명 포함) — 삭제 가능 */
  isOwn?: boolean;
}

function isOwnComment(c: CommentData): boolean {
  return c.isOwn === true || c.author === "나";
}

interface PostData {
  id: number;
  board: string;
  title: string;
  content: string;
  author: string;
  time: string;
  likes: number;
  likedByMe: boolean;
  comments: CommentData[];
}

const initialPosts: PostData[] = [
  { id: 1, board: "청각장애 게시판", title: "수어 통역사 동반 가능한 면접 후기", content: "IT 기업 면접 시 수어 통역사 대동이 가능했습니다. 면접관분들이 저를 직접 바라봐 주셔서 소통이 원활했어요.", author: "익명", time: "10분 전", likes: 12, likedByMe: false, comments: [{ id: 101, author: "익명1", text: "좋은 정보네요!", time: "5분 전" }] },
  { id: 2, board: "지체장애 게시판", title: "판교역 4번 출구 무장애 식당 공유", content: "입구 경사로가 완만하고 내부 공간이 넓어 전동 휠체어 진입이 매우 수월합니다.", author: "익명", time: "1시간 전", likes: 24, likedByMe: false, comments: [] },
  { id: 3, board: "취업정보", title: "5월 장애인 직무 교육 리스트", content: "웹 접근성 심사원 양성 과정 모집 중입니다. 공단 홈페이지를 확인하세요.", author: "운영자", time: "3시간 전", likes: 45, likedByMe: false, comments: [] },
  { id: 4, board: "자유게시판", title: "첫 출근 너무 떨려요 응원 부탁드려요!", content: "드디어 내일 첫 출근입니다. 실수하지 않고 잘 적응하고 싶네요.", author: "익명", time: "5시간 전", likes: 89, likedByMe: false, comments: [] },
  { id: 5, board: "동네 소모임", title: "이번 주 토요일 탄천 산책 모임", content: "날씨 좋은 주말에 가볍게 산책하실 동네 주민 구합니다.", author: "익명", time: "하루 전", likes: 15, likedByMe: false, comments: [] },
  { id: 6, board: "청각장애 게시판", title: "문자 통역 앱 '에이아이' 사용 후기", content: "회의 때 실시간으로 자막이 나와서 업무 효율이 정말 좋아졌어요.", author: "익명", time: "2일 전", likes: 30, likedByMe: false, comments: [] },
  { id: 7, board: "시각장애 게시판", title: "스크린 리더 호환성 좋은 코딩 에디터", content: "VS Code가 생각보다 접근성 설정이 잘 되어 있어서 추천합니다.", author: "익명", time: "3일 전", likes: 22, likedByMe: false, comments: [] },
  { id: 8, board: "발달장애 게시판", title: "직무 지도원분과 함께하는 첫 업무", content: "옆에서 차근차근 알려주셔서 긴장이 많이 풀렸습니다.", author: "익명", time: "4일 전", likes: 18, likedByMe: false, comments: [] },
  { id: 9, board: "지체장애 게시판", title: "저상버스 예약 시스템 꿀팁", content: "미리 앱으로 예약하면 기사님이 정류장에서 더 신경 써 주시더라고요.", author: "익명", time: "5일 전", likes: 41, likedByMe: false, comments: [] },
  { id: 10, board: "취업정보", title: "재택근무 사무보조 채용 공고", content: "이동이 어려운 분들에게 좋은 기회일 것 같습니다.", author: "운영자", time: "6일 전", likes: 56, likedByMe: false, comments: [] },
];

interface CommunityClientProps {
  isLoggedIn: boolean;
}

export default function CommunityClient({ isLoggedIn }: CommunityClientProps) {
  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [activeBoard, setActiveBoard] = useState<string>("전체보기");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostBoard, setNewPostBoard] = useState<string>("자유게시판");

  const boardCategories = ["전체보기", "자유게시판", "취업정보", "청각장애 게시판", "시각장애 게시판", "지체장애 게시판", "발달장애 게시판", "동네 소모임"];

  useEffect(() => {
    const savedData = localStorage.getItem("choiceWorkCommunityData_v3");
    if (savedData) {
      setPosts(JSON.parse(savedData) as PostData[]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("choiceWorkCommunityData_v3", JSON.stringify(posts));
  }, [posts, isLoaded]);

  useEffect(() => {
    if (!showLoginModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLoginModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showLoginModal]);

  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

  const filteredPosts = sortedPosts.filter(post => {
    const matchBoard = activeBoard === "전체보기" || post.board === activeBoard;
    const matchSearch = post.title.includes(searchQuery) || post.content.includes(searchQuery);
    return matchBoard && matchSearch;
  });

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowWriteModal(true);
  };

  const handleLike = (postId: number) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setPosts(posts.map(post => {
      if (post.id === postId && !post.likedByMe) {
        return { ...post, likes: post.likes + 1, likedByMe: true };
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newEntry: PostData = {
      id: Date.now(),
      board: newPostBoard,
      title: newPostTitle,
      content: newPostContent,
      author: "나",
      time: "방금 전",
      likes: 0,
      likedByMe: false,
      comments: []
    };
    setPosts([newEntry, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowWriteModal(false);
  };

  const handleDeleteComment = (postId: number, comment: CommentData) => {
    if (!isOwnComment(comment)) return;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: post.comments.filter((x) => x.id !== comment.id),
        };
      })
    );
  };

  const handleAddComment = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!newComment.trim() || !selectedPostId) return;
    setPosts(posts.map(post => {
      if (post.id === selectedPostId) {
        const commentEntry: CommentData = {
          id: Date.now(),
          author: isAnonymous ? "익명" : "나",
          text: newComment,
          time: "방금 전",
          isOwn: true,
        };
        return {
          ...post,
          comments: [...post.comments, commentEntry]
        };
      }
      return post;
    }));
    setNewComment("");
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-12 gap-6">

        {/* 왼쪽: 사이드바 */}
        <aside className="col-span-12 md:col-span-3 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
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
            <button
              onClick={handleWriteClick}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
            >
              <PenLine size={18} /> 새 글 쓰기
            </button>
          </div>
        </aside>

        {/* 중앙: 메인 피드 */}
        <main className="col-span-12 md:col-span-6 space-y-4">
          {selectedPostId && selectedPost ? (
            /* 상세 화면 */
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
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
              <p className="text-slate-700 leading-relaxed mb-8 whitespace-pre-wrap">{selectedPost.content}</p>
              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => handleLike(selectedPost.id)}
                  disabled={selectedPost.likedByMe}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition disabled:opacity-50 ${selectedPost.likedByMe ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}
                >
                  <ThumbsUp size={16} /> {selectedPost.likedByMe ? "공감 완료" : "공감"} {selectedPost.likes}
                </button>
              </div>
              {/* 댓글 섹션 */}
              <div className="border-t pt-8">
                <h3 className="font-bold text-slate-900 mb-4">댓글 {selectedPost.comments.length}</h3>
                <div className="space-y-4 mb-6">
                  {selectedPost.comments.map((c) => {
                    const own = isOwnComment(c);
                    return (
                      <div
                        key={c.id}
                        role={own ? "button" : undefined}
                        tabIndex={own ? 0 : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (own) handleDeleteComment(selectedPost.id, c);
                        }}
                        onKeyDown={(e) => {
                          if (!own) return;
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleDeleteComment(selectedPost.id, c);
                          }
                        }}
                        title={own ? "클릭하여 삭제" : undefined}
                        className={`rounded-xl border p-4 transition ${
                          own
                            ? "cursor-pointer border-emerald-200/80 bg-emerald-50/40 hover:border-rose-200 hover:bg-rose-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            : "border-slate-100 bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-xs font-bold ${c.author === "나" ? "text-emerald-600" : "text-slate-700"}`}
                          >
                            {c.author}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="text-sm text-slate-700">{c.text}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <button
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`flex items-center gap-1 text-xs font-medium transition ${isAnonymous ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${isAnonymous ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
                        {isAnonymous && <Check size={12} className="text-white" />}
                      </div> 익명으로 남기기
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text" value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      placeholder="따뜻한 댓글을 남겨주세요."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddComment}
                      className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-600 transition"
                    >
                      등록
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 목록 화면 */
            <>
              <div className="bg-white p-2 pl-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-2">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="글, 제목, 내용 검색"
                  className="w-full bg-transparent border-none text-sm focus:outline-none py-2"
                />
              </div>
              <div className="space-y-3">
                <div className="px-2 py-1 mb-2 font-bold text-slate-800 flex justify-between items-center">
                  <span>{activeBoard} <span className="text-emerald-500 ml-1">{filteredPosts.length}</span></span>
                </div>
                {filteredPosts.map((post) => (
                  <div key={post.id} onClick={() => setSelectedPostId(post.id)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase">{post.board}</span>
                      <span className="text-[11px] text-slate-400">{post.time}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">{post.title}</h4>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-3">{post.content}</p>
                    <div className="flex justify-between items-center text-slate-400">
                      <div className="flex items-center gap-1 text-[11px]"><User size={14} /><span>{post.author}</span></div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[11px]"><ThumbsUp size={14} className={post.likedByMe ? "text-rose-500" : ""} /><span className={post.likedByMe ? "text-rose-500 font-bold" : ""}>{post.likes}</span></div>
                        <div className="flex items-center gap-1 text-[11px]"><MessageSquare size={14} className="text-blue-500" /><span className="text-blue-500">{post.comments.length}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* 오른쪽: HOT 섹션 */}
        <aside className="hidden md:block col-span-3">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-rose-500" />
              <h3 className="font-bold text-slate-900">HOT 게시물</h3>
            </div>
            <div className="space-y-4">
              {posts.filter(p => p.likes > 40).slice(0, 3).map(hp => (
                <div key={hp.id} onClick={() => setSelectedPostId(hp.id)} className="cursor-pointer group">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 line-clamp-1">{hp.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1">공감 {hp.likes} · 댓글 {hp.comments.length}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 로그인 안내 */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="login-modal-title" className="text-center text-base font-bold leading-snug text-slate-900">
              좋아요 및 기능은 로그인 후에 이용할 수 있습니다
            </h2>
            <Link
              href="/auth/login?next=/community"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              onClick={() => setShowLoginModal(false)}
            >
              로그인하러가기
            </Link>
          </div>
        </div>
      )}

      {/* 새 글 쓰기 모달 */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <h2 className="text-2xl font-bold mb-6">새로운 이야기 작성</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="board-select" className="text-xs font-bold text-slate-400 mb-1 block">게시판 선택</label>
                <select
                    id="board-select"
                    title="게시판 선택"
                    aria-label="게시판 선택"
                    value={newPostBoard}
                    onChange={(e) => setNewPostBoard(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {boardCategories.filter(b => b !== "전체보기").map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <input
                type="text" placeholder="제목을 입력하세요"
                value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
              />
              <textarea
                placeholder="내용을 입력하세요" rows={6}
                value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowWriteModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">취소</button>
                <button onClick={handleCreatePost} className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition">등록하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
