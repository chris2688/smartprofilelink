# 🚀 실제 Instagram API 연동 완료 가이드

## ✅ 완료된 작업

1. ✅ **Instagram API 설정 가이드 작성** (`INSTAGRAM_API_SETUP.md`)
2. ✅ **Backend OAuth 플로우 구현**
3. ✅ **Backend Instagram API 호출 구현**
4. ✅ **Frontend OAuth 연동 UI 구현**

---

## 📋 실제 연동을 위한 필수 설정

### 1단계: Meta Developer 앱 생성

**자세한 내용은 `INSTAGRAM_API_SETUP.md` 파일을 참고하세요!**

간단 요약:
1. https://developers.facebook.com/ 접속
2. 앱 만들기 → "비즈니스" 선택
3. Instagram 제품 추가
4. **앱 ID와 앱 시크릿** 확인

---

### 2단계: Backend 환경 변수 설정

`backend/.env` 파일을 생성하고 다음 내용 추가:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smartprofilelink"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Instagram API (⭐ 여기에 Meta 앱 정보 입력!)
INSTAGRAM_APP_ID="your-app-id-here"
INSTAGRAM_APP_SECRET="your-app-secret-here"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/sns/instagram/callback"

# Frontend URL (CORS)
FRONTEND_URL="http://localhost:8080"

# Server
PORT=3000
NODE_ENV="development"
```

⚠️ **중요**: `INSTAGRAM_APP_ID`와 `INSTAGRAM_APP_SECRET`를 Meta Developer에서 확인한 값으로 교체하세요!

---

### 3단계: Backend 실행

```bash
cd backend

# 의존성 설치 (처음 한 번만)
npm install

# Prisma 설정 (PostgreSQL 실행 중이어야 함)
npx prisma generate
npx prisma migrate dev --name init

# Backend 서버 실행
npm run start:dev
```

Backend 서버가 http://localhost:3000 에서 실행됩니다.

---

### 4단계: PostgreSQL 설치 및 실행

#### Windows (Docker 사용 권장):

```powershell
# Docker Desktop 설치 필요
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# 데이터베이스 생성
docker exec -it postgres psql -U postgres
CREATE DATABASE smartprofilelink;
\q
```

#### 또는 PostgreSQL 직접 설치:

1. https://www.postgresql.org/download/windows/ 에서 다운로드
2. 설치 후 pgAdmin에서 `smartprofilelink` 데이터베이스 생성

---

### 5단계: Flutter 앱 실행 (이미 실행 중)

```bash
cd mobile
flutter run -d chrome --web-port=8080
```

---

## 🔧 실제 연동 플로우

### 연동 과정:

1. **사용자**: Flutter 앱에서 "SNS 연동" → "Instagram 연동하기" 클릭
2. **Frontend**: `http://localhost:3000/sns/instagram/auth?userId={userId}` 로 리디렉션
3. **Backend**: Instagram OAuth URL 생성 및 리디렉션
4. **Instagram**: 사용자 로그인 및 권한 승인 요청
5. **사용자**: 권한 승인
6. **Instagram**: Authorization code와 함께 `http://localhost:3000/sns/instagram/callback` 호출
7. **Backend**: 
   - Authorization code → Access Token 교환
   - Short-lived token → Long-lived token 교환 (60일)
   - 사용자 정보 및 통계 조회
   - DB에 저장
8. **Backend**: `http://localhost:8080/sns-connect?success=true&platform=instagram` 로 리디렉션
9. **Frontend**: 연동 완료 메시지 표시 및 통계 자동 표시

---

## 📱 테스트 방법

### 현재 상태:

✅ **Backend OAuth 구현 완료**
- `/sns/instagram/auth` - OAuth 시작
- `/sns/instagram/callback` - OAuth 콜백

✅ **Frontend OAuth UI 완료**
- "Instagram 연동하기" 버튼
- OAuth 브라우저 열기

⚠️ **실제 연동을 위해 필요한 것:**

1. ✅ Meta Developer 앱 생성
2. ✅ Instagram API 설정
3. ✅ `.env` 파일 설정
4. ✅ PostgreSQL 실행
5. ✅ Backend 실행
6. ✅ Frontend 실행

---

## 🎯 실제 연동 테스트

### 1. Backend 실행 확인

```bash
cd backend
npm run start:dev
```

콘솔에 다음과 같이 표시되어야 합니다:
```
[Nest] 12345 - Application is running on: http://localhost:3000
```

### 2. Flutter 앱에서 테스트

1. **로그인** (샘플 계정: test@example.com / password123)
2. **홈 화면** → **SNS 연동** 클릭
3. **Instagram** 카드에서 **"연동하기"** 버튼 클릭
4. **"Instagram 연동 시작"** 버튼 클릭
5. **Instagram 로그인 페이지**로 이동
6. **Instagram Business 계정**으로 로그인
7. **권한 승인**
8. **자동으로 앱으로 돌아옴**
9. **통계 자동 표시 확인!**

---

## ⚠️ 주의사항

### Instagram Business 계정 필요

- **개인 계정은 사용 불가**
- Instagram Business 또는 Creator 계정으로 전환 필요
- Facebook 페이지에 연결 필요

### 앱 검수 (개발 단계)

- **개발 모드**: 테스트 사용자만 사용 가능
- Meta Developer → **역할 → 테스트 사용자**에 Instagram 계정 추가

### 프로덕션 배포

- 앱 검수 신청 필요 (1-2주 소요)
- 검수 통과 후 모든 사용자 사용 가능

---

## 🔄 샘플 모드 ↔ 실제 모드 전환

### 샘플 모드로 돌아가기:

`mobile/lib/features/sns/data/repositories/sns_repository.dart`:
```dart
final bool useMockData = true; // 샘플 모드
```

### 실제 모드 사용:

`mobile/lib/features/sns/data/repositories/sns_repository.dart`:
```dart
final bool useMockData = false; // 실제 Instagram API 사용
```

현재 설정: **false** (실제 모드)

---

## 📊 수집되는 데이터

### 계정 정보:
- 사용자 이름
- Instagram User ID
- 계정 타입

### 통계:
- 팔로워 수
- 팔로잉 수
- 게시물 수
- 평균 좋아요
- 평균 댓글
- 참여율 (ER)

### 게시물 (최근 25개):
- 이미지/비디오
- 캡션
- 좋아요 수
- 댓글 수
- 게시 시간
- 협찬 여부 (자동 감지)

---

## 🛠️ 문제 해결

### Backend가 실행되지 않음
- `.env` 파일 확인
- PostgreSQL 실행 확인
- `npm install` 다시 실행

### Instagram 인증 실패
- Meta Developer 앱 설정 확인
- Redirect URI가 정확한지 확인: `http://localhost:3000/sns/instagram/callback`
- 테스트 사용자로 추가되었는지 확인

### 통계가 표시되지 않음
- Instagram Business 계정인지 확인
- Facebook 페이지에 연결되었는지 확인
- Backend 콘솔 로그 확인

---

## 📚 관련 문서

- `INSTAGRAM_API_SETUP.md` - Instagram API 설정 상세 가이드
- `SETUP_GUIDE.md` - 전체 프로젝트 설정 가이드
- `backend/env.example` - 환경 변수 예제

---

## 🎉 다음 단계

### 현재 완료:
- ✅ Instagram OAuth 연동
- ✅ 실시간 통계 수집
- ✅ 포트폴리오 자동 생성

### 추가 구현 가능:
- YouTube API 연동
- TikTok API 연동
- 자동 제안서 PDF 생성
- 광고 단가 계산기
- 브랜드 문의 시스템

---

## 💡 팁

### 개발 단계에서:
- 테스트 사용자로 충분히 테스트
- Rate Limit 주의 (시간당 200 calls)
- Long-lived token 자동 갱신 구현 추천

### 프로덕션 배포 전:
- 앱 검수 준비 (스크린샷, 설명)
- HTTPS 적용
- 프로덕션 도메인 설정
- Rate Limit 모니터링

---

이제 실제 Instagram 계정 연동이 가능합니다! 🚀

Meta Developer 앱만 만들면 바로 실제 데이터를 가져올 수 있습니다!

