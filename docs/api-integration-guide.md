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

### A. 장애인 구인 실시간 현황 API (한국장애인고용공단)
- **설명**: 현재 진행 중인 장애인 구인 사업체 현황 및 모집 직무 데이터를 XML로 제공
- **주요 필드(예시)**:
  - `busplaName`(사업장명)
  - `jobNm`(모집 직종)
  - `compAddr`(사업장 주소)
  - `employmentType`(고용 형태)
  - `salary`(임금)
  - `reqCareer`(요구 경력)
- **사용 기능**:
  - 추천 일자리 후보군 생성
  - 지역/고용형태 기반 필터링
  - 작업환경 포함 API(`/job_list_env`)를 통한 접근성 조건 확장

### B. 장애인 표준사업장 실시간 조회 API
- **설명**: 공단 인증을 받은 장애인 표준사업장 실시간 정보를 XML로 제공
- **주요 필드(예시)**:
  - `authNum`(인증번호)
  - `authDate`(인증일자)
  - `bizrno`(사업자등록번호)
  - `cmpnm`(사업체명)
  - `adres`(주소)
- **사용 기능**:
  - 표준사업장 인증 여부 확인
  - 기업 친화도 점수의 보조 지표
  - 기업 상세 정보 강화

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

API_KEY = os.getenv("ODCLOUD_API_KEY")
BASE_URL = "https://api.odcloud.kr/api/15054713/v1/uddi:9741cfd1-ff55-4555-bf21-f59ead6bed36"

params = {
    "serviceKey": API_KEY,
    "page": 1,
    "perPage": 20,
    "returnType": "json"
}

response = requests.get(BASE_URL, params=params, timeout=10)
response.raise_for_status()
data = response.json()
print(data)
```

### 예상 응답 구조(JSON 예시)

```json
{
  "page": 1,
  "perPage": 20,
  "totalCount": 281,
  "currentCount": 20,
  "data": [
    {
      "지역명": "강원특별자치도",
      "업종명": "A.농업, 임업 및 어업",
      "사업체수": 3
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
   - 장려금 사업체 현황 JSON API 호출 및 정규화
2. `services/standard_workplace_service.py`
   - 표준사업장 XML API 호출 및 JSON 변환
3. `services/live_job_service.py`
   - 장애인 구인 XML API 호출 및 JSON 변환
4. `services/scoring_service.py`
   - 지표 정규화 + `friendlinessScore` 계산
5. `routers/companies.py`, `routers/jobs.py`, `routers/supports.py`
   - 서비스 함수 호출 후 스키마로 변환하여 반환
6. 프론트엔드
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
- 예: `ODCLOUD_API_KEY=...`, `DATA_GO_API_KEY=...`
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
- [x] 공공데이터포털 키 발급 완료
- [x] `.env`에 API 키 설정
- [x] `services`에 API 호출 함수 작성
- [ ] `routers`에서 mock -> 실데이터로 전체 교체
- [ ] 점수 계산 로직(`scoring_service`) 반영

## 오늘 작업 반영 사항
- `public_data_service.py`로 장려금 지원 사업체 현황 live API 연동 완료
- `standard_workplace_service.py`로 표준사업장 실시간 조회 연동 완료
- `live_job_service.py`로 장애인 구인 실시간 현황 및 작업환경 포함 API 연동 완료
- 한글 깨짐 대응을 위해 응답 디코딩/문자 보정 처리 추가
- Railway 배포용 `Procfile`, `nixpacks.toml` 설정 완료
- 프론트 기본 화면은 아직 mock 데이터 기반이며, live API는 백엔드 검증 단계
