# Choicework (초이스워크)

## 1. 서비스 한 줄 소개

**실시간 구인 공공 API와 근무환경 지표로, 내 장애 유형에 맞는 채용을 빠르게 비교합니다.** *(MVP 1차: 경기도 중심)*

---

## 2. 문제 정의 & 대상 사용자

### 문제 정의

- **구직자(장애인·청년)**는 채용 공고는 보지만, **실제 근무환경·장애 친화도** 같은 의사결정에 필요한 정보를 한곳에서 얻기 어렵습니다.
- **기업**은 채용 시 받을 수 있는 **지원금·제도**를 충분히 알기 어렵고, 신청까지 이어지지 않습니다.
- 기존 채용 플랫폼은 **공고 나열**에 가깝고, “내 조건에 맞는 일자리와 기관 연결”까지 이어 주기 어렵습니다.

### 대상 사용자

| 구분 | 설명 |
|------|------|
| **주 사용자** | 경기도 거주 또는 경기도 일자리를 찾는 **장애인·청년 구직자** |
| **보조 사용자** | 장애인 채용을 검토하는 **기업 인사·채용 담당자** |

---

## 3. 핵심 아이디어 & 차별점

- **경기도 집중 전략**  
  초기 검증 단계에서 지역 범위를 명확히 해 **데이터 품질·개발 속도·사용자 시나리오**를 동시에 잡고, 스키마는 전국 확장이 가능한 형태로 유지합니다.
- **공공데이터 기반 실시간 연동**  
  채용·표준사업장·장려금·지역 접근성 등을 **공공데이터포털·유관 API**와 연결해, 목업이 아닌 **실데이터**로 탐색·상세 화면을 구성합니다.
- **장애유형·근무환경을 고려한 추천**  
  고용공단 제공 **근무환경(env) 필드**와 장애 유형 필터를 맞춰, “이 공고가 나에게 맞는지” 판단을 돕습니다.
- **탐색 → 확인 → 행동** 연결  
  홈 통계부터 **맞춤 일자리(추천)·상세·지원금 안내**, 이어서 **한국장애인고용공단 구직 상담** 등 실제 이용으로 연결합니다.

---

## 4. 주요 기능 & 사용자 여정

시나리오: **화면 접속에서 공단 이용 안내까지** 한 흐름으로 완주할 수 있도록 설계했습니다.

| 단계 | 화면/기능 | 설명 |
|------|-----------|------|
| **홈** | 실시간 구인 통계, 기업 점수 카드, 구인 카드 목록 | 공공 API 기반 현황을 한눈에 보여 주고 카드 탐색을 시작합니다. |
| **추천** | `/recommendations` 장애 유형 필터 + 일자리 목록 | 지체·시각·청각·발달·기타 등 선택 시 근무환경 조건과 매칭한 후보를 봅니다. |
| **상세** | `/job/[id]` 구인 상세, `/company/[id]` 기업 상세 | 급여·경력·마감일, env 6개 항목, 표준사업장·지원 패널 등을 제공합니다. |
| **저장·비교 보조** | 찜(bookmark, localStorage) | 로그인 없이 관심 공고·기업을 남길 수 있습니다. |
| **지원금·연계** | 지원금 카드 영역 → 공단 신청 페이지 링크, 구인 상세 **공단 지원 상담** 버튼 | 계산기·안내 후 **실제 신청·상담**으로 이어집니다. |

---

## 5. 데이터 출처 & 기술 스택

### 사용 공공데이터·외부 출처

- **한국장애인고용공단 장애인 구인 정보** (`data.go.kr` B552583 구인 API) — 실시간 구인 목록·근무환경(env)·홈 통계 연동  
- **한국장애인고용공단 장애인 표준사업장 실시간 조회** — 인증 정보·사업체 식별(기업 상세 연계)  
- **공공데이터포털 오픈 API(ODcloud)** — **장려금 참여 기업 현황** 등 연도·지역별 지표  
- **경기도 오픈 API** — **시군별 장애인활동지원 기관**(선택 적용 시 기업 접근성·종합점수 반영)

> API 키·활용 승인은 [공공데이터포털](https://www.data.go.kr/)·각 기관 안내를 따릅니다.

### 기술 스택

- **Frontend**  
  - Next.js(App Router), TypeScript, Tailwind CSS  
  - 클라우드 배포 예: Vercel  
- **Backend**  
  - FastAPI, Pydantic / pydantic-settings  
  - `requests` 등으로 공공 XML·JSON 호출 후 정규화  
  - 로컬·클라우드 예: Railway(루트 디렉터리 `backend`)  
- **Infra·기타**  
  - 단일 레포(monorepo) · 환경 변수로 API URL·CORS·키 관리  
  - 백엔드 프로세스 기동 시 SQLite 등은 MVP 범위 밖이면 mock·실 API 혼합 구조 유지  

---

## 6. 기대 효과 & 핵심 지표

### 기대 효과

- 구직자의 **정보 비대칭 완화**와 **스스로 선택할 수 있는 의사결정** 지원  
- 기업의 **제도 활용 장벽 완화** 및 공단 채널로의 안전한 유도  

### 검증용 KPI (예시, MVP 기간 측정)

| KPI | 정의 예시 |
|-----|-----------|
| **추천 페이지 진입률** | 홈 또는 메뉴 대비 `/recommendations` 유입 비율 |
| **상세 페이지 전환율** | 목록·카드 노출 대비 구인·기업 상세 진입 비율 |
| **지원금 계산기 사용률** | 홈·지원 섹션 방문 대비 계산·카드 상호작용 비율 |
| **공단 상담·신청 링크 클릭률** | 상세·지원 영역에서 외부 공단 URL 클릭 비율 |

---

## 7. 로컬 실행 방법 (Quick Start)

```bash
git clone https://github.com/hufsacedevelopers/first_repository.git
cd first_repository
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# .env에 ODCLOUD_API_KEY, DATA_GO_API_KEY(또는 대체 키), CORS_ORIGINS 등 설정
python -m uvicorn app.main:app --reload
```

- API 기본 주소: `http://127.0.0.1:8000`  
- 헬스체크: `GET /health`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# 실제 백엔드 사용 시 .env.local에 한 줄 추가:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

- 웹 기본 주소: `http://localhost:3000`  
- `NEXT_PUBLIC_API_URL`을 비우면 **mock 데이터**로 동작합니다(공공 API 키 없이 UI 확인용).

### 환경 변수 요약

| 위치 | 변수 | 설명 |
|------|------|------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | 백엔드 베이스 URL(끝 `/` 없이). 미설정 시 mock |
| `backend/.env` | `CORS_ORIGINS` | 프론트 origin (예: `http://localhost:3000`) |
| `backend/.env` | `ODCLOUD_API_KEY`, `DATA_GO_API_KEY` 등 | 공공데이터 API 호출용(가이드는 `docs/` 참고) |

---

## 8. 프로젝트 구조 & 개발일지 링크

```text
/
├── frontend/     # Next.js 앱
├── backend/      # FastAPI 앱
├── data/         # 참고용 mock JSON
└── docs/         # 기획·API·배포 문서
```

| 문서 | 내용 |
|------|------|
| [docs/planning.md](docs/planning.md) | 문제 정의, 경기도 전략, 로드맵, **일자별 개발일지** |
| [docs/data-plan.md](docs/data-plan.md) | 데이터 활용·확장 계획 |
| [docs/api-integration-guide.md](docs/api-integration-guide.md) | 공공 API 연동 가이드 |
| [docs/vercel-frontend-deploy-checklist.md](docs/vercel-frontend-deploy-checklist.md) | 프론트 배포 체크리스트 |

---

## 한 줄 컨셉

> 취업을 **대신** 연결하는 것이 아니라, **데이터로 선택할 수 있게** 만든다.
