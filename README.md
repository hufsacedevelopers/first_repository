# 🚀 장애인 취업 의사결정 플랫폼 (AI + 기업 평가)

> 취업 정보를 넘어서, **기업을 데이터로 평가하고 AI로 연결하는 플랫폼**

## 📌 프로젝트 소개

본 프로젝트는 장애인과 청년을 위한 **AI 기반 취업 의사결정 플랫폼**입니다.

- 공공데이터 기반으로 기업의 장애 친화도 점수를 계산
- 사용자에게 적합한 일자리와 기업 추천
- 고용주에게 장애인 채용 지원금/혜택 안내

현재는 **초기 개발 환경 세팅 + mock 데이터 기반 MVP** 단계이며,  
아직 실제 공공데이터 API 연동은 진행하지 않았습니다.

## 📂 모노레포 구조

```text
/
├── frontend/   # Next.js (App Router, TypeScript, Tailwind)
├── backend/    # FastAPI (routers/services/schemas)
├── data/       # mock JSON 데이터
├── docs/       # 기획/데이터/API 문서
├── package.json  # 루트 편의 스크립트
├── README.md
└── .gitignore
```

## ⚙️ 환경 변수 설정

### Backend

```bash
cd backend
cp .env.example .env   # .env 파일을 만들고 필요한 값을 채워주세요
```

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `APP_ENV` | `development` | 실행 환경 |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | 허용할 프론트엔드 주소 |

### Frontend

```bash
cd frontend
cp .env.example .env.local
```

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | (없음) | 비워두면 mock 데이터 사용, 값 입력 시 실제 백엔드 호출 |

## 🖥️ Frontend 실행 방법

```bash
cd frontend
npm install
npm run dev
```

- 기본 주소: `http://localhost:3000`
- `NEXT_PUBLIC_API_URL` 미설정 시 mock 데이터로 동작합니다.

## ⚙️ Backend 실행 방법

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

- 기본 주소: `http://localhost:8000`
- 제공 엔드포인트:
  - `GET /health`
  - `GET /companies`
  - `GET /companies/standard-workplaces/live`
  - `GET /jobs`
  - `GET /jobs/live`
  - `GET /jobs/live-with-env`
  - `GET /supports`
  - `GET /supports/incentives/live`

## 🚂 Railway 배포 (Backend)

이 레포는 모노레포이므로 Railway 서비스의 **Root Directory를 `backend`** 로 설정하세요.

1. Railway에서 GitHub 레포 연결
2. 서비스 Root Directory를 `backend`로 지정
3. 환경변수 등록
   - `APP_ENV=production`
   - `CORS_ORIGINS=["https://<your-frontend-domain>"]`
   - `ODCLOUD_API_KEY=<your-key>`
   - `ODCLOUD_BASE_URL=https://api.odcloud.kr/api`
4. 배포 후 확인
   - `/health`
   - `/supports/incentives/live?year=2024&page=1&perPage=10`

배포 설정 파일:
- `backend/Procfile`
- `backend/nixpacks.toml`

## 🧪 테스트 실행 (Backend)

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

## 🔍 린트 실행 (Backend)

```bash
cd backend
ruff check .
```

## 🗂️ data 폴더 설명

`data` 폴더는 백엔드와 프론트에서 공통으로 참고 가능한 mock 원천 데이터입니다.

- `companies.json`: 기업 장애 친화도 관련 지표
- `jobs.json`: 추천 일자리 정보
- `supports.json`: 장애인 채용 지원금/혜택 정보

## 🧾 docs 폴더 문서

- `docs/planning.md`: 기획 배경 및 MVP 목표
- `docs/data-plan.md`: 데이터 활용 계획 및 확장 포인트
- `docs/api-spec.md`: API 명세 초안
- `docs/api-integration-guide.md`: 공공데이터 API 연동 가이드

## 🛠️ 현재 기술 스택

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic, pydantic-settings
- Data: JSON mock 데이터

## 🚀 향후 확장 계획

- PostgreSQL 연동
- 공공데이터 API 수집/정규화 파이프라인
- AI 기반 개인화 추천 로직 고도화

## 🔥 한 줄 컨셉

> "취업을 연결하는 것이 아니라, 선택할 수 있게 만든다"
