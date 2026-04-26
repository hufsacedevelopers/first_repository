# API 명세 초안

Base URL: `http://localhost:8000`

## `GET /health`
- 설명: 서버 상태 확인
- 응답 예시:
```json
{
  "status": "ok"
}
```

## `GET /companies`
- 설명: 기업 장애 친화도 목록 조회
- 응답 필드:
  - `companyName` (string)
  - `location` (string)
  - `disabledEmploymentRate` (number)
  - `retentionRate` (number)
  - `jobDiversity` (number)
  - `friendlinessScore` (number)

## `GET /jobs`
- 설명: 추천 일자리 목록 조회
- 응답 필드:
  - `title` (string)
  - `companyName` (string)
  - `location` (string)
  - `employmentType` (string)
  - `accessibilityTags` (string[])

## `GET /supports`
- 설명: 장애인 채용 지원금/혜택 목록 조회
- 응답 필드:
  - `supportName` (string)
  - `target` (string)
  - `amount` (string)
  - `description` (string)
