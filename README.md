# Choicework (ChoiceWork)

## 1. 서비스 한 줄 소개

**공공 구인·근무환경 데이터와 지역 정보를 한곳에 모아, 장애 유형에 맞는 일자리를 빠르게 비교하고 동네 연결까지 이어 줍니다.** *(MVP: 경기도 중심 시나리오, 스키마는 전국 확장 가능)*

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
- **공공데이터 기반 연동**  
  채용·표준사업장·장려금·**시군별 장애인활동지원 기관** 등을 **공공데이터포털·경기도·유관 API**와 연결해, UI는 실데이터 우선·실패 시에도 **시드·추정 요약**으로 빈 화면을 줄입니다.
- **장애유형·근무환경을 고려한 추천**  
  고용공단 제공 **근무환경(env) 필드**와 장애 유형 필터를 맞춰, “이 공고가 나에게 맞는지” 판단을 돕습니다.
- **동네·부담 낮은 첫 연결**  
  **`/gigs` 가벼운 일거리**: 경기도 공개 기관 목록(선택 시 내 위치 기준 거리순)과 시연용 시드 카드로, 이력서 부담 없이 **지역 연결** 스토리를 보여 줍니다.
- **탐색 → 확인 → 행동** 연결  
  홈 통계부터 **맞춤 일자리·상세·지역별 검색·데이터 요약**, **지원금·활동지원 기관** 안내, 이어서 **한국장애인고용공단** 상담·신청 링크로 연결합니다.

---

## 4. 주요 기능 & 사용자 여정

시나리오: **화면 접속에서 공단·기관 안내까지** 한 흐름으로 탐색할 수 있도록 설계했습니다.

| 단계 | 화면/기능 | 설명 |
|------|-----------|------|
| **홈** | 실시간 구인 통계, 퀵 링크(추천·기업·근무환경·지역별 등) | 공공 데이터 기반 현황과 주요 메뉴로 진입합니다. |
| **추천** | `/recommendations` 장애 유형 필터 + 일자리 목록 | 지체·시각·청각·발달·기타 선택 시 근무환경 조건과 매칭한 후보를 봅니다. |
| **상세** | `/job/[id]` 구인 상세, `/company/[id]` 기업 상세 | 급여·경력·마감일, env 항목, 표준사업장·지원 패널 등을 제공합니다. |
| **지역·환경·요약** | `/jobs/regions`, `/jobs/environment`, `/jobs/insights` | 시·군 필터, 근무환경 프리셋 필터, 공고 분포·수집 요약(백엔드 미연결 시 **추정 요약** 표시). |
| **가벼운 일거리** | `/gigs`, `/gigs/[id]` | 경기도 **장애인활동지원 기관** 실데이터(백엔드 연동 시) 또는 시연 시드. 내 위치 허용 시 **거리순** 정렬. |
| **지원·기관** | `/support`, `/support/gyeonggi-activity-support`, `/support/consulting` 등 | 지원금·장려금·표준사업장 조회, 경기도 활동지원 기관 목록. |
| **저장·비교 보조** | 찜(bookmark, localStorage) | 로그인 없이 관심 공고·기업을 남길 수 있습니다(데모 로그인은 선택). |
| **예외 화면** | `app/not-found.tsx` | 존재하지 않는 경로에 대해 브랜드 톤의 안내·홈·추천으로 복귀합니다. |

---

## 5. 데이터 출처 & 기술 스택

### 사용 공공데이터·외부 출처

- **한국장애인고용공단 장애인 구인 정보** (`data.go.kr` B552583 구인 API) — 실시간 구인·근무환경(env)·병합 메타·인사이트 페이지  
- **한국장애인고용공단 장애인 표준사업장 실시간 조회** — 인증 정보·사업체 식별(기업 상세 연계)  
- **공공데이터포털 ODcloud** — **장려금 참여 기업 현황** 등 연도·지역별 지표  
- **경기도 Open API** — **시군별 장애인활동지원 기관** (`/accessibility/institutions`, 기업 접근성 점수 등에 활용)

> API 키·활용 승인은 [공공데이터포털](https://www.data.go.kr/)·[경기도 공공데이터](https://data.gg.go.kr/)·각 기관 안내를 따릅니다.

### 기술 스택

- **Frontend** — Next.js(App Router) 16, React 19, TypeScript, Tailwind CSS  
- **Backend** — FastAPI, Pydantic / pydantic-settings, `requests`로 공공 XML·JSON 호출 후 정규화  
- **Infra** — 단일 레포(monorepo), 환경 변수로 API URL·CORS·키 관리  

---

## 6. 기대 효과 & 핵심 지표

### 기대 효과

- 구직자의 **정보 비대칭 완화**와 **스스로 선택할 수 있는 의사결정** 지원  
- 기업의 **제도 활용 장벽 완화** 및 공단·지역 채널로의 안전한 유도  

### 검증용 KPI (예시, MVP 기간 측정)

| KPI | 정의 예시 |
|-----|-----------|
| **추천 페이지 진입률** | 홈 또는 메뉴 대비 `/recommendations` 유입 비율 |
| **상세 페이지 전환율** | 목록·카드 노출 대비 구인·기업 상세 진입 비율 |
| **지원금·기관 안내 클릭률** | 지원·활동지원·공단 링크 클릭 비율 |
| **가벼운 일거리 이용** | `/gigs` 진입·내 위치 정렬 사용 비율 |

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
# .env에 DATA_GO_API_KEY(또는 B552583_API_KEY), GG_API_KEY(선택), CORS_ORIGINS 등 설정
python -m uvicorn app.main:app --reload
```

- API 기본 주소: `http://127.0.0.1:8000`  
- 헬스체크: `GET /health`  
- 주요 라우터: `/jobs`, `/jobs/live-merged`, `/jobs/live-comparison`, `/accessibility`, `/companies` 등 (`app/main.py` 참고)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# 실제 백엔드 사용 시 .env.local 예시:
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

- 웹 기본 주소: `http://localhost:3000`  
- `NEXT_PUBLIC_API_URL`(또는 `NEXT_PUBLIC_API_BASE_URL`)이 없으면 **클라이언트 측 KEAD·mock** 위주로 동작합니다(키 없이 UI 확인용).  
- 운영에서 mock 허용이 필요하면 `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK=true`(기본은 비권장).

### 환경 변수 요약

| 위치 | 변수 | 설명 |
|------|------|------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | 백엔드 베이스 URL(끝 `/` 없이). `NEXT_PUBLIC_API_BASE_URL`도 동일 목적로 호환 |
| `frontend/.env.local` | `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK` | `true`일 때 API 실패 시 mock 등으로 보조(운영은 신중히) |
| `backend/.env` | `CORS_ORIGINS` | 프론트 origin JSON 배열 또는 쉼표 구분 문자열 |
| `backend/.env` | `DATA_GO_API_KEY`, `B552583_API_KEY` | `data.go.kr` 구인·표준사업장 등(우선순위는 설정 모듈 참고) |
| `backend/.env` | `ODCLOUD_API_KEY` | ODcloud 장려금 등 |
| `backend/.env` | `GG_API_KEY`, `GG_API_BASE_URL` | 경기도 활동지원 기관 API(미설정 시 해당 기능은 빈 결과·스킵) |

자세한 키 이름·URL 기본값은 **`backend/.env.example`**, **`frontend/.env.example`** 를 기준으로 합니다.

---

## 8. 프로젝트 구조 & 문서

```text
/
├── frontend/          # Next.js 앱 (app/, components/, lib/)
├── backend/           # FastAPI 앱 (app/routers, app/services)
├── data/              # 참고용 mock JSON
└── docs/              # 기획·API·배포 문서
```

| 문서 | 내용 |
|------|------|
| [docs/planning.md](docs/planning.md) | 문제 정의, 로드맵, 개발 메모 |
| [docs/data-plan.md](docs/data-plan.md) | 데이터 활용·확장 계획 |
| [docs/api-integration-guide.md](docs/api-integration-guide.md) | 공공 API 연동 가이드 |
| [docs/vercel-frontend-deploy-checklist.md](docs/vercel-frontend-deploy-checklist.md) | 프론트 배포 체크리스트 |

---

## 한 줄 컨셉

> 취업을 **대신** 연결하는 것이 아니라, **데이터로 선택할 수 있게** 만든다.
