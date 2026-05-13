# ChoiceWork

## 1. 서비스 한 줄 소개

**공공 구인·근무환경 데이터와 지역 정보를 한곳에 모아, 장애 유형에 맞는 일자리를 빠르게 비교합니다.** 시·도부터 단계적으로 고르는 **지역별 검색**, **기업 장애 친화도**(가중치·근무환경 6축 방법론 공개), 경기도 **장애인활동지원 기관** 등 공개 정보를 함께 두어 **일자리·기업·생활 동선·기관 안내**를 한 흐름으로 살펴볼 수 있게 합니다.

---

## 2. 문제 정의 & 대상 사용자

### 문제 정의

- **구직자(장애인·청년)**는 채용 공고는 보지만, **실제 근무환경·장애 친화도** 같은 의사결정에 필요한 정보를 한곳에서 얻기 어렵습니다.
- **기업**은 채용 시 받을 수 있는 **지원금·제도**를 충분히 알기 어렵고, 신청까지 이어지지 않습니다.
- 기존 채용 플랫폼은 **공고 나열**에 가깝고, “내 조건에 맞는 일자리와 기관 연결”까지 이어 주기 어렵습니다.

### 대상 사용자

| 구분 | 설명 |
|------|------|
| **주 사용자** | **장애인·청년 구직자** — 공고 나열을 넘어 근무환경·친화도·지역을 근거로 선택하고 싶은 사람 |
| **보조 사용자** | 장애인 채용을 검토하는 **기업 인사·채용 담당자** |

---

## 3. 핵심 아이디어 & 차별점

- **공공데이터 기반 연동**  
  채용·표준사업장·장려금·**시군별 장애인활동지원 기관**(경기도 Open API) 등을 **공공데이터포털·유관 API**와 연결합니다. UI는 실데이터 우선이며, 실패 시 **시드·추정 요약·mock 폴백**으로 빈 화면을 줄입니다.
- **기업 장애 친화도(Company Rating)**  
  백엔드에서 고용률·근속·직무 다양성·표준사업장·구인 **근무환경 6축** 등을 가중 합산한 **0–100점**과 `ratingBreakdown`을 산출하고, **`GET /companies/rating-methodology`** 로 가중치·산출식을 공개합니다. 프론트 `/companies`에서는 구인 공고 풀과 기업명 **정규화 매칭**으로 일자리 검색에 보이는 기업과 친화도 비교를 이어 줍니다.
- **장애 유형·근무환경을 고려한 추천**  
  고용공단 **근무환경(env) 필드**와 장애 유형 필터를 맞춰 후보를 좁힙니다.
- **지역 탐색**  
  `/jobs/regions`에서 **시·도 → 시·군·구** 순으로 선택(공고 `location` 기준). 생활 접근성 등 일부 지표는 경기도 기관 밀도 데이터를 사용합니다.
- **탐색 → 확인 → 행동**  
  홈·추천·상세·기업 평가·지역·지원·공단 링크로 이어지는 흐름을 유지합니다.

---

## 4. 주요 기능 & 사용자 여정

시나리오: **화면 접속에서 공단·기관 안내까지** 한 흐름으로 탐색할 수 있도록 설계했습니다.

| 단계 | 화면/기능 | 설명 |
|------|-----------|------|
| **홈** | 실시간 구인 통계, 통합검색(→추천), 취업 도메인 링크, 퀵 카드(추천·기업·근무환경·지역별 등) | 주요 메뉴로 진입합니다. 지역은 홈에서 시·군 칩으로 바로 가지 않고 **지역별 검색**에서 시·도부터 선택합니다. |
| **추천** | `/recommendations` 장애 유형 필터 + 일자리 목록 | 지체·시각·청각·발달·기타 선택 시 근무환경 조건과 매칭한 후보를 봅니다. 카드에 **매칭 %**를 표시합니다. |
| **기업 친화도** | `/companies`, `/company/[id]` | 기업명 검색 시 구인 공고 풀과 동일한 기업명을 묶고, API에 있으면 **친화도·`ratingBreakdown`**, 없으면 공고 근무환경 점수로 추정합니다. 방법론·가중치는 API 또는 로컬 데모 스냅샷으로 표시합니다. |
| **상세** | `/job/[id]` 구인 상세, `/company/[id]` 기업 상세 | 급여·경력·마감일, env 항목, 표준사업장·지원 패널 등을 제공합니다. |
| **지역·환경·요약** | `/jobs/regions`, `/jobs/environment`, `/jobs/insights` | **시·도 → 시·군·구**(또는 도 전체) 단계 필터, 근무환경 프리셋, 공고 분포·수집 요약. |
| **지원·기관** | `/support`, `/support/gyeonggi-activity-support`, `/support/consulting` 등 | 지원금·장려금·표준사업장 조회, 경기도 활동지원 기관 목록. |
| **저장·비교 보조** | 찜(localStorage) + **`/saved-jobs` 관심 공고** | 카드·상세에서 ♡ 저장 후 한 번에 모아 봅니다. 로그인 없이 동작합니다. |
| **예외 화면** | `app/not-found.tsx` | 존재하지 않는 경로에 대해 브랜드 톤의 안내·홈·추천으로 복귀합니다. |

### 향후 확장 기능

- **가벼운 일거리 (`/gigs`)** — 경기도 **장애인활동지원 기관** 목록·거리순 등 **부담 낮은 지역 연결** 시나리오를 위한 실험 라우트입니다. 현재는 메인 네비에 노출하지 않으며, 후속 고도화 시 제품 여정에 맞춰 다시 묶을 예정입니다.

---

## 5. 데이터 출처 & 기술 스택

### 사용 공공데이터·외부 출처

- **한국장애인고용공단 장애인 구인 정보** (`data.go.kr` B552583 구인 API) — 실시간 구인·근무환경(env)·병합 메타·인사이트 페이지  
- **한국장애인고용공단 장애인 표준사업장 실시간 조회** — 인증 정보·사업체 식별(기업 상세 연계)  
- **공공데이터포털 ODcloud** — **장려금 참여 기업 현황** 등 연도·지역별 지표  
- **경기도 Open API** — **시군별 장애인활동지원 기관** (`/accessibility/institutions`, 기업 **생활 접근성**·종합 점수 등에 활용)

구인 `businessName`과 표준사업장 `workplaceName` 매칭에는 백엔드 **`company_name_normalize`**(법인 표기 제거 등)를 사용합니다. 프론트 기업 검색·공고 풀 병합에도 동일한 의도의 **`company-name-normalize`** 가 있습니다.

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

### 검증용 KPI (예시)

| KPI | 정의 예시 |
|-----|-----------|
| **추천 페이지 진입률** | 홈 또는 메뉴 대비 `/recommendations` 유입 비율 |
| **상세 페이지 전환율** | 목록·카드 노출 대비 구인·기업 상세 진입 비율 |
| **지원금·기관 안내 클릭률** | 지원·활동지원·공단 링크 클릭 비율 |
| **기업 친화도·방법론 조회** | `/companies` 검색·상세·방법론 블록 노출 대비 클릭 또는 상세 전환 비율 |

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
- 주요 라우터: `/jobs`, `/jobs/live-merged`, `/jobs/live-comparison`, `/accessibility`, `/companies`, **`/companies/rating-methodology`** 등 (`app/main.py` 참고)  
- 백엔드 테스트: `pytest tests/test_api.py` (Windows에서는 `py -m pytest …` 권장)

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
- **로컬 개발**에서 기업 친화도 카드·방법론만 더미로 고정하려면(백엔드 없이 UI 확인): `NODE_ENV=development`일 때 기본값이며, 실제 `/companies` API를 쓰려면 **`NEXT_PUBLIC_USE_LIVE_COMPANY_API=true`** 를 설정합니다.  
- **배포** `/companies`: 검색어 입력 시에만 기업 목록 API를 호출하고, 구인 공고와 기업명 **정규화**로 풀을 맞춥니다.

### 환경 변수 요약

| 위치 | 변수 | 설명 |
|------|------|------|
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL` | 백엔드 베이스 URL(끝 `/` 없이). `NEXT_PUBLIC_API_BASE_URL`도 동일 목적로 호환 |
| `frontend/.env.local` | `NEXT_PUBLIC_ALLOW_MOCK_FALLBACK` | `true`일 때 API 실패 시 mock 등으로 보조(운영은 신중히) |
| `frontend/.env.local` | `NEXT_PUBLIC_USE_LIVE_COMPANY_API` | 로컬에서 `true`이면 기업 친화도도 백엔드 `/companies`·방법론 API 사용(기본은 dev에서 더미) |
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
│                      # lib/data.ts: API·mock·KEAD 폴백, lib/job-regions.ts: 지역 단계, company-name-normalize 등
├── backend/           # FastAPI (routers, services, company_rating_service, company_name_normalize)
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
