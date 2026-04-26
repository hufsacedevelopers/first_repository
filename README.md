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
├── README.md
└── .gitignore
```

## 🖥️ Frontend 실행 방법

```bash
cd frontend
npm install
npm run dev
```

- 기본 주소: `http://localhost:3000`
- mock 데이터를 사용해 메인 화면, 기업 리스트, 점수 카드, 추천 일자리 카드가 표시됩니다.

## ⚙️ Backend 실행 방법

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

- 기본 주소: `http://localhost:8000`
- 제공 엔드포인트:
  - `GET /health`
  - `GET /companies`
  - `GET /jobs`
  - `GET /supports`

## 🗂️ data 폴더 설명

`data` 폴더는 백엔드와 프론트에서 공통으로 참고 가능한 mock 원천 데이터입니다.

- `companies.json`: 기업 장애 친화도 관련 지표
- `jobs.json`: 추천 일자리 정보
- `supports.json`: 장애인 채용 지원금/혜택 정보

## 🧾 docs 폴더 문서

- `docs/planning.md`: 기획 배경 및 MVP 목표
- `docs/data-plan.md`: 데이터 활용 계획 및 확장 포인트
- `docs/api-spec.md`: API 명세 초안

## 🛠️ 현재 기술 스택

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic
- Data: JSON mock 데이터

## 🚀 향후 확장 계획

- PostgreSQL 연동
- 공공데이터 API 수집/정규화 파이프라인
- AI 기반 개인화 추천 로직 고도화

## 🔥 한 줄 컨셉

> “취업을 연결하는 것이 아니라, 선택할 수 있게 만든다”
