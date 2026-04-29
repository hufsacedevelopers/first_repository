# API 명세 초안

Base URL: `http://localhost:8000`

## 현재 상태
- 기본 mock API와 일부 공공데이터 live API가 함께 제공됩니다.
- 프론트 기본 화면은 현재 `GET /companies`, `GET /jobs`, `GET /supports`를 기준으로 동작합니다.
- live API는 백엔드 검증 및 추후 프론트 연동용으로 추가된 상태입니다.

## `GET /health`
- 설명: 서버 상태 확인
- 응답 예시:
```json
{
  "status": "ok"
}
```

## `GET /companies`
- 설명: mock 기반 기업 장애 친화도 목록 조회
- 응답 필드:
  - `companyName` (string)
  - `location` (string)
  - `disabledEmploymentRate` (number)
  - `retentionRate` (number)
  - `jobDiversity` (number)
  - `friendlinessScore` (number)

## `GET /companies/standard-workplaces/live`
- 설명: 장애인 표준사업장 실시간 조회(XML -> JSON 변환)
- 쿼리 파라미터:
  - `pageNo` (number, default: 1)
  - `numOfRows` (number, default: 20)
- 응답 필드:
  - `pageNo` (number)
  - `numOfRows` (number)
  - `totalCount` (number)
  - `data[].certificationNumber` (string)
  - `data[].certificationDate` (string)
  - `data[].businessRegistrationNumber` (string)
  - `data[].workplaceName` (string)
  - `data[].address` (string)
  - `data[].phoneNumber` (string)

## `GET /jobs`
- 설명: mock 기반 추천 일자리 목록 조회
- 응답 필드:
  - `title` (string)
  - `companyName` (string)
  - `location` (string)
  - `employmentType` (string)
  - `accessibilityTags` (string[])

## `GET /jobs/live`
- 설명: 장애인 구인 실시간 현황 조회(XML -> JSON 변환)
- 쿼리 파라미터:
  - `pageNo` (number, default: 1)
  - `numOfRows` (number, default: 20)
- 응답 필드:
  - `pageNo` (number)
  - `numOfRows` (number)
  - `totalCount` (number)
  - `data[].businessName` (string)
  - `data[].jobName` (string)
  - `data[].employmentType` (string)
  - `data[].salaryType` (string)
  - `data[].salary` (string)
  - `data[].companyAddress` (string)
  - `data[].requiredCareer` (string)
  - `data[].requiredEducation` (string)

## `GET /jobs/live-with-env`
- 설명: 장애인 구인 실시간 현황 조회(작업환경 포함)
- 쿼리 파라미터:
  - `pageNo` (number, default: 1)
  - `numOfRows` (number, default: 20)
- 추가 응답 필드:
  - `envBothHands` (string)
  - `envEyesight` (string)
  - `envHandwork` (string)
  - `envLiftPower` (string)
  - `envLstnTalk` (string)
  - `envStndWalk` (string)

## `GET /supports`
- 설명: mock 기반 장애인 채용 지원금/혜택 목록 조회
- 응답 필드:
  - `supportName` (string)
  - `target` (string)
  - `amount` (string)
  - `description` (string)

## `GET /supports/incentives/live`
- 설명: 지역별 업종별 장려금 지원 사업체 현황 조회(JSON 정규화)
- 쿼리 파라미터:
  - `year` (number, default: 2024, range: 2018~2025)
  - `page` (number, default: 1)
  - `perPage` (number, default: 100)
- 응답 필드:
  - `page` (number)
  - `perPage` (number)
  - `totalCount` (number)
  - `currentCount` (number)
  - `data[].year` (number)
  - `data[].region` (string)
  - `data[].industry` (string)
  - `data[].businessCount` (number)
