# 공공데이터 API 연동 가이드

## 목적
이 문서는 팀원이 공공데이터 API를 빠르게 이해하고, 현재 프로젝트(`FastAPI + Next.js`)에 바로 연동할 수 있도록 작성한 실무 가이드입니다.

---

## 1) 공공데이터 API 사용 흐름

### 1. 공공데이터포털 회원가입
1. [공공데이터포털](https://www.data.go.kr/) 가입/로그인
2. 원하는 API 검색 후 활용신청
3. 승인 완료 후 Open API 인증키(서비스키) 확인

### 2. API 키 발급/관리
- 포털 마이페이지에서 `일반 인증키(Encoding/Decoding)` 확인
- 개발 초기에는 Decoding 키를 사용하면 디버깅이 편함
- 운영 단계에서는 `.env`로 주입하여 코드에 하드코딩 금지

### 3. API 요청 구조
일반적인 요청 형태:

```text
{BASE_URL}?serviceKey={API_KEY}&pageNo=1&numOfRows=10&resultType=json
```

- `BASE_URL`: 기관별 엔드포인트
- `serviceKey`: 인증키
- `pageNo`, `numOfRows`: 페이징
- `resultType`: `json` 권장 (가능한 API 기준)

---

## 2) 사용 예정 API 목록

### A. 워크넷 채용정보 API
- **설명**: 채용공고, 직무, 근무지역 등 채용 관련 데이터 제공
- **주요 필드(예시)**:
  - `companyName`(기업명)
  - `jobTitle`(채용 직무)
  - `location`(근무 지역)
  - `employmentType`(고용 형태)
  - `postedAt`(등록일)
- **사용 기능**:
  - 추천 일자리 후보군 생성
  - 지역/고용형태 기반 필터링

### B. 장애인 고용 데이터 (한국장애인고용공단)
- **설명**: 기업/기관 단위 장애인 고용률 및 관련 통계 데이터
- **주요 필드(예시)**:
  - `companyName`(기업명)
  - `disabledEmploymentRate`(장애인 고용률)
  - `retentionRate`(근속률 또는 유지율 성격 지표)
  - `industry`(업종)
  - `region`(지역)
- **사용 기능**:
  - 기업 장애 친화도 점수 계산 입력값
  - 기업 비교/랭킹 리스트

### C. 장애인 고용 장려금/지원금 데이터
- **설명**: 사업주 대상 지원금, 지원 조건, 지원 한도 정보
- **주요 필드(예시)**:
  - `supportName`(지원 제도명)
  - `target`(지원 대상)
  - `amount`(지원 금액/한도)
  - `description`(요건 및 내용)
  - `period`(신청 기간)
- **사용 기능**:
  - 기업 맞춤형 지원금 안내
  - 채용 의사결정 보조 정보 제공

---

## 3) API 호출 예시

### Python (`requests`) 예시

```python
import os
import requests

API_KEY = os.getenv("PUBLIC_DATA_API_KEY")
BASE_URL = "https://api.example.go.kr/jobs"  # 실제 엔드포인트로 교체

params = {
    "serviceKey": API_KEY,
    "pageNo": 1,
    "numOfRows": 20,
    "resultType": "json"
}

response = requests.get(BASE_URL, params=params, timeout=10)
response.raise_for_status()
data = response.json()
print(data)
```

### 예상 응답 구조(JSON 예시)

```json
{
  "resultCode": "00",
  "resultMsg": "NORMAL SERVICE",
  "totalCount": 1200,
  "items": [
    {
      "companyName": "한빛IT솔루션",
      "jobTitle": "웹 접근성 QA 어시스턴트",
      "location": "서울",
      "employmentType": "정규직"
    }
  ]
}
```

---

## 4) 데이터 가공 방식 (장애 친화도 점수)

### 기본 아이디어
서로 단위가 다른 지표를 0~100으로 정규화한 뒤 가중합으로 점수를 계산합니다.

### 예시 수식

```text
friendlinessScore =
  0.40 * disabledEmploymentRateNorm +
  0.30 * retentionRateNorm +
  0.20 * jobDiversityNorm +
  0.10 * accessibilityPolicyNorm
```

- `disabledEmploymentRateNorm`: 장애인 고용률 정규화
- `retentionRateNorm`: 근속/유지율 정규화
- `jobDiversityNorm`: 장애인 채용 직무 다양성 지표
- `accessibilityPolicyNorm`: 편의시설/제도 운영 지표(추후 확장)

초기 MVP에서는 `accessibilityPolicyNorm`을 고정값 또는 mock 지표로 대체할 수 있습니다.

---

## 5) Backend 구조 연결 방법

현재 백엔드 구조:
- `backend/app/services`: 외부 API 호출/데이터 가공
- `backend/app/routers`: 엔드포인트 정의 및 응답 반환
- `backend/app/schemas`: 응답 스키마 정의

### 권장 연결 흐름
1. `services/public_data_service.py`
   - 공공데이터 API 호출 함수 작성 (`fetch_worknet_jobs()`, `fetch_disabled_employment_stats()` 등)
2. `services/scoring_service.py`
   - 지표 정규화 + `friendlinessScore` 계산
3. `routers/companies.py`, `routers/jobs.py`, `routers/supports.py`
   - 서비스 함수 호출 후 스키마로 변환하여 반환
4. 프론트엔드
   - 추후 `frontend/lib/api.ts`에서 백엔드 API 호출
   - 현재 mock 데이터에서 API 기반 렌더링으로 교체

```text
공공데이터 API -> services(수집/가공/점수화) -> routers(FastAPI 응답) -> frontend 화면
```

---

## 6) 주의사항

### 1. 호출 제한(Rate Limit)
- 기관별 일일/분당 호출 제한이 다름
- 초기에는 요청 횟수 최소화(배치 수집 + 내부 재사용)

### 2. API 키 보안
- API 키는 `.env`에 저장
- 예: `PUBLIC_DATA_API_KEY=...`
- Git 커밋 금지 (`.gitignore` 확인)

### 3. 에러 처리
- 타임아웃, 인증 실패, 응답 포맷 변경에 대비
- `try/except` + 로깅 + 기본 fallback 데이터 적용
- 사용자 응답은 500 공통 메시지보다, 가능한 범위에서 원인 구분(예: 외부 API 일시 장애)

---

## 7) 향후 확장

### 1. DB 저장 방식
- PostgreSQL에 원천 테이블 + 정규화 테이블 분리
- 예: `raw_public_jobs`, `companies`, `jobs`, `supports`, `company_scores`

### 2. 캐싱 전략
- Redis 또는 메모리 캐시로 단기 캐싱(TTL)
- 자주 조회되는 목록(`/companies`, `/jobs`)은 캐시 우선

### 3. AI 추천 연결
- 점수화된 기업 데이터 + 사용자 프로필을 feature로 구성
- 추천 서비스 레이어(`recommendation_service.py`) 추가
- 추후 모델/룰 기반 하이브리드 추천으로 확장

---

## 빠른 체크리스트
- [ ] 공공데이터포털 키 발급 완료
- [ ] `.env`에 API 키 설정
- [ ] `services`에 API 호출 함수 작성
- [ ] `routers`에서 mock -> 실데이터로 교체
- [ ] 점수 계산 로직(`scoring_service`) 반영
