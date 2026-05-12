/**
 * 가벼운 일거리(동네 1일 체험) — MVP 시드 데이터.
 * 향후 고용공단 표준사업장 등 공공 데이터와 매칭해 확장할 수 있도록 필드를 분리해 둡니다.
 */

export interface LightGig {
  id: string;
  title: string;
  workplaceName: string;
  sigungu: string;
  durationHours: number;
  summary: string;
  tasks: string[];
  environmentNotes: string;
  ownerReview: string;
  /** 심사·기획 설명용: 표준사업장/업종 매핑 가정 (실연동 전) */
  standardWorkplaceCategory: string;
}

const SEED_GIGS: LightGig[] = [
  {
    id: "gg-bundang-cafe-01",
    title: "오전 카운터 포장·라벨 부착 도움",
    workplaceName: "분당 ○○ 베이커리",
    sigungu: "성남시 분당구",
    durationHours: 2.5,
    summary: "오전 시간대에 소분 포장과 유통기한 스티커 부착을 함께합니다. 대화는 최소로, 손 작업 위주입니다.",
    tasks: ["소분 비닐 포장", "유통기한 라벨 정렬·부착", "작업대 정리"],
    environmentNotes: "매장 입구 턱 2cm, 작업대 높이 조절 가능. 조용한 편입니다.",
    ownerReview:
      "시간 약속을 잘 지키시고, 라벨을 빠지지 않게 꼼꼼히 붙여 주셔서 덕분에 오전 준비가 빨리 끝났어요.",
    standardWorkplaceCategory: "음식점업 — 제과점(소매)",
  },
  {
    id: "gg-suwon-bookstore-02",
    title: "도서관 반납구 정리·책장 배열",
    workplaceName: "수원 ○○ 작은도서관",
    sigungu: "수원시 팔달구",
    durationHours: 2,
    summary: "반납된 도서를 분류 번호 순으로 꽂고, 아이들 코너 책장을 정돈합니다.",
    tasks: ["반납도서 분류대 배열", "책등 정렬", "간단한 먼지 털기"],
    environmentNotes: "엘리베이터 있음. 복도 넓음. 안내 데스크와 가까워 질문이 쉽습니다.",
    ownerReview: "말없이 끝까지 정리해 주셔서 신뢰가 갔습니다. 다음에도 부탁드리고 싶어요.",
    standardWorkplaceCategory: "도서관·기록보존(유사) — 지역 독서문화",
  },
  {
    id: "gg-goyang-flower-03",
    title: "화훼 농장 — 선별 상자 옮기기",
    workplaceName: "고양 ○○ 화훼단지 협동조합",
    sigungu: "고양시 일산동구",
    durationHours: 3,
    summary: "이미 선별된 화분을 지정 구역으로 옮기고, 빈 상자를 접어 둡니다. 무게는 한 박스 3kg 내외입니다.",
    tasks: ["선별존 → 출하존 박스 이동", "빈 상자 접기", "바닥 잔여물 쓸기"],
    environmentNotes: "비닐하우스 평지. 휠체어 동선 협의 후 배치 가능. 햇빛·온도 변화 있음.",
    ownerReview: "무거운 것만 피해서 나눠 주신 덕분에 현장이 안전했어요. 서로 배려가 느껴졌습니다.",
    standardWorkplaceCategory: "농업 — 화훼 재배·도매",
  },
  {
    id: "gg-bucheon-pack-04",
    title: "택배 소포 라벨 검수",
    workplaceName: "부천 ○○ 물류센터(소형)",
    sigungu: "부천시 원미구",
    durationHours: 2,
    summary: "이미 포장된 소포의 주소 라벨이 기울어지지 않았는지 육안으로 확인합니다.",
    tasks: ["라벨 방향·가림 여부 확인", "이상 건 별도 트레이 분리"],
    environmentNotes: "작업대 앉은 자세 가능. 소음 중간. 청력 보조기 사용 시 별도 안내.",
    ownerReview: "집중해서 빠르게 훑어 주셔서 오류 박스가 줄었습니다.",
    standardWorkplaceCategory: "운수·창고 — 소형 풀필먼트",
  },
  {
    id: "gg-yongin-shelter-05",
    title: "보호센터 간식 포장 자원봉사",
    workplaceName: "용인 ○○ 동물보호센터",
    sigungu: "용인시 기흥구",
    durationHours: 2.5,
    summary: "간식 봉투 나눔용 소분 포장과 날짜 스티커 부착을 돕습니다. 동물 접촉은 없습니다.",
    tasks: ["간식 소분", "날짜 스티커 부착", "작업 후 테이블 소독"],
    environmentNotes: "실내. 배수구턱 있음(안내 가능). 냄새에 민감한 분은 마스크 권장.",
    ownerReview: "꼼꼼하게 포장해 주셔서 봉사자분들이 편했어요. 책임감이 느껴졌습니다.",
    standardWorkplaceCategory: "기타 서비스 — 비영리 봉사 협력",
  },
  {
    id: "gg-ansan-recycle-06",
    title: "재활용 분리수거장 안내 보조",
    workplaceName: "안산 ○○ 주민자치센터",
    sigungu: "안산시 단원구",
    durationHours: 2,
    summary: "방문 주민에게 분리 배출 안내표를 짚어 주고, 빈 상자 정리를 돕습니다.",
    tasks: ["안내표 짚어주기", "빈 박스 접기", "간단 안내 멘트(스크립트 제공)"],
    environmentNotes: "1층. 휠체어 접근 가능. 야외 천막 구역 일부 자갈(동선 안내).",
    ownerReview: "처음 오신 분도 편하게 다가가 설명해 주셔서 민원이 줄었습니다.",
    standardWorkplaceCategory: "공공 — 주민편의(재활용)",
  },
];

/** 사장님 한 줄 후기에서 역량 키워드 추출 (MVP: 규칙 기반, 추후 LLM 보조 가능) */
const REVIEW_RULES: { pattern: RegExp; tags: string[] }[] = [
  { pattern: /꼼꼼|빠지지|라벨|정확/, tags: ["꼼꼼함", "정확성"] },
  { pattern: /정리|끝까지|깔끔/, tags: ["정리력", "완수력"] },
  { pattern: /시간 약속|약속|신뢰/, tags: ["시간 관념", "신뢰"] },
  { pattern: /책임|맡겨|안전/, tags: ["책임감", "안전 의식"] },
  { pattern: /집중|빠르게|훑어/, tags: ["집중력", "효율"] },
  { pattern: /배려|나눠|편하게|민원/, tags: ["배려", "소통"] },
  { pattern: /말없이|조용/, tags: ["침착함", "자기주도"] },
];

export function extractCompetencyKeywords(ownerReview: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const { pattern, tags } of REVIEW_RULES) {
    if (pattern.test(ownerReview)) {
      for (const t of tags) {
        if (!seen.has(t)) {
          seen.add(t);
          out.push(t);
        }
      }
    }
  }
  if (out.length === 0) {
    return ["협업", "성실성"];
  }
  return out.slice(0, 6);
}

export async function getLightGigs(): Promise<LightGig[]> {
  return [...SEED_GIGS];
}

export async function getLightGigById(id: string): Promise<LightGig | null> {
  return SEED_GIGS.find((g) => g.id === id) ?? null;
}
