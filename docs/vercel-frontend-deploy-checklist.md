# Vercel Frontend 배포 체크리스트

## 목적
프론트를 Vercel에 배포할 때, Railway 백엔드와 안정적으로 연결되도록 최소 점검 항목을 정리합니다.

## 0) 현재 상태 점검
- `NEXT_PUBLIC_API_URL`로 연결할 백엔드의 `/health`가 200이어야 합니다.
- 점검 명령 예시:
  - `curl https://<railway-backend-domain>/health`
- 502/503이면 프론트 배포 전에 백엔드부터 복구해야 합니다.

## 1) Vercel 프로젝트 설정
- GitHub 레포 연결 후 `Root Directory`를 `frontend`로 설정
- Framework Preset: `Next.js`

## 2) Vercel 환경변수
- `NEXT_PUBLIC_API_URL=https://<railway-backend-domain>`
- 값 끝에 `/`를 붙이지 않기
- Preview/Production 환경 모두 설정 권장

## 3) Railway 환경변수/CORS
- `APP_ENV=production`
- `CORS_ORIGINS=["https://<vercel-production-domain>"]`
- Preview 도메인도 허용하려면 CORS 리스트에 preview 도메인 추가
- API 키 환경변수(`ODCLOUD_API_KEY`, 필요시 `DATA_GO_API_KEY`) 누락 여부 확인

## 4) 배포 후 기능 점검
- 프론트 URL 접속 시 메인 페이지 렌더 확인
- 브라우저 개발자도구 Network에서 확인:
  - `/companies` 200
  - `/jobs` 200
- `/recommendations` 페이지 이동 및 필터 동작 확인

## 5) 장애 대응 기준
- 백엔드 일시 장애 시 프론트는 mock fallback으로 동작하도록 이미 설정됨
- 하지만 운영에서는 fallback에 의존하지 말고 백엔드 헬스 상태를 먼저 복구하는 것을 원칙으로 함

## 6) 릴리즈 전 최종 확인
- `frontend/.env.local`은 로컬 전용으로 유지
- Vercel 환경변수가 최신 Railway 도메인을 가리키는지 확인
- README/문서의 배포 URL과 실제 URL 불일치 여부 확인
