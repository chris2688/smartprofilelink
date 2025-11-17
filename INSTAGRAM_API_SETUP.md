# 📸 Instagram API 연동 설정 가이드

## 🎯 개요

실제 Instagram 계정을 연동하기 위해서는 **Meta (Facebook) Developer** 계정과 앱이 필요합니다.

---

## 📋 필요한 것

1. **Meta (Facebook) 계정**
2. **Instagram Business 또는 Creator 계정** (개인 계정 불가)
3. **Facebook 페이지** (Instagram과 연결된)

---

## 🔧 1단계: Meta Developer 앱 생성

### 1. Meta Developer 사이트 접속

https://developers.facebook.com/

### 2. 앱 만들기

1. **"내 앱"** → **"앱 만들기"** 클릭
2. **앱 유형 선택**: "비즈니스"
3. **앱 이름**: SmartProfileLink
4. **앱 연락처 이메일**: 본인 이메일
5. **비즈니스 포트폴리오**: (선택사항)
6. **"앱 만들기"** 클릭

### 3. 앱 ID 및 시크릿 확인

- **앱 ID**: 대시보드에 표시됨 (예: 123456789012345)
- **앱 시크릿**: **설정 → 기본 설정**에서 확인

⚠️ **중요**: 앱 시크릿은 절대 공개하지 마세요!

---

## 🔐 2단계: Instagram Graph API 설정

### 1. 제품 추가

1. 대시보드에서 **"제품 추가"** 클릭
2. **"Instagram"** 선택 → **"설정"** 클릭

### 2. OAuth 리디렉션 URI 설정

**설정 → 기본 설정 → 앱 도메인**에 추가:

#### 개발 환경:
```
http://localhost:3000/api/auth/instagram/callback
```

#### 프로덕션 환경:
```
https://yourdomain.com/api/auth/instagram/callback
```

### 3. 권한 설정

**앱 검수 → 권한 및 기능**에서 다음 권한 요청:

- ✅ `instagram_basic`
- ✅ `pages_show_list`
- ✅ `pages_read_engagement`
- ✅ `instagram_manage_insights`

---

## 🔑 3단계: 환경 변수 설정

### Backend `.env` 파일 생성

`backend/.env` 파일을 만들고 다음 내용을 추가:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smartprofilelink"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
REFRESH_TOKEN_EXPIRES_IN="30d"

# Instagram API
INSTAGRAM_APP_ID="your-app-id-here"
INSTAGRAM_APP_SECRET="your-app-secret-here"
INSTAGRAM_REDIRECT_URI="http://localhost:3000/api/auth/instagram/callback"

# Frontend URL (CORS)
FRONTEND_URL="http://localhost:8080"
```

⚠️ **중요**: `.env` 파일은 절대 Git에 커밋하지 마세요!

---

## 📱 4단계: Instagram Business 계정 연결

### Instagram을 Facebook 페이지에 연결

1. **Facebook 페이지 생성** (없는 경우)
2. **Instagram Business 계정으로 전환**:
   - Instagram 앱 → 설정 → 계정 → 비즈니스로 전환
3. **Instagram을 Facebook 페이지에 연결**:
   - Facebook 페이지 설정 → Instagram → 계정 연결

---

## 🧪 5단계: 테스트 사용자 추가 (개발 단계)

앱이 **개발 모드**일 때는 테스트 사용자만 사용 가능:

1. **역할 → 테스트 사용자** 메뉴
2. **"테스트 사용자 추가"** 클릭
3. 테스트할 Instagram 계정 추가

---

## 🚀 6단계: 앱 검수 및 배포

### 개발 단계

- 앱이 **개발 모드**일 때는 테스트 사용자만 사용 가능
- 제한된 API 호출 가능

### 프로덕션 배포

1. **앱 검수 신청**:
   - 필요한 권한 설명
   - 사용 사례 설명
   - 스크린샷 제공
   - 검수 통과 (보통 1-2주 소요)

2. **앱 모드 전환**:
   - 개발 모드 → 라이브 모드

---

## 📊 Instagram Graph API - 수집 가능한 데이터

### 계정 정보
- 사용자 이름
- 프로필 사진
- 팔로워 수
- 팔로잉 수
- 게시물 수

### 미디어 (게시물)
- 미디어 ID
- 캡션 (텍스트)
- 미디어 타입 (이미지/비디오/캐러셀)
- 미디어 URL
- 타임스탬프
- 좋아요 수
- 댓글 수
- 저장 수
- 공유 수
- 재생 수 (비디오)
- 참여율

### Insights (인사이트)
- 노출 수
- 도달 수
- 참여 수
- 프로필 조회 수
- 웹사이트 클릭 수

---

## 🔐 OAuth 플로우

### 1. 사용자 인증 시작

```
https://api.instagram.com/oauth/authorize?
  client_id={app-id}&
  redirect_uri={redirect-uri}&
  scope=user_profile,user_media&
  response_type=code
```

### 2. 사용자 승인

사용자가 Instagram에서 로그인하고 권한 승인

### 3. Authorization Code 수신

```
http://localhost:3000/api/auth/instagram/callback?code={authorization-code}
```

### 4. Access Token 교환

```
POST https://api.instagram.com/oauth/access_token
{
  client_id: {app-id},
  client_secret: {app-secret},
  grant_type: authorization_code,
  redirect_uri: {redirect-uri},
  code: {authorization-code}
}
```

### 5. Long-Lived Token 획득

Short-lived token (1시간) → Long-lived token (60일)

```
GET https://graph.instagram.com/access_token?
  grant_type=ig_exchange_token&
  client_secret={app-secret}&
  access_token={short-lived-token}
```

---

## 📚 참고 자료

- **Instagram Graph API 공식 문서**: https://developers.facebook.com/docs/instagram-api
- **Instagram Basic Display API**: https://developers.facebook.com/docs/instagram-basic-display-api
- **OAuth 가이드**: https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow

---

## ⚠️ 주의사항

### Rate Limits (API 호출 제한)

- **Graph API**: 시간당 200 calls/user
- **Insights**: 일일 5,000 calls/app

### 데이터 제한

- 최근 25개 미디어만 조회 가능 (Basic Display API)
- Business 계정만 Insights 접근 가능

### Token 관리

- Short-lived token: 1시간
- Long-lived token: 60일
- 자동 갱신 필요 (만료 전)

---

## 🎯 다음 단계

1. ✅ Meta Developer 앱 생성
2. ✅ Instagram API 설정
3. ✅ 환경 변수 설정
4. ▶️ Backend OAuth 구현
5. ▶️ Frontend 연동

---

## 💡 문제 해결

### 앱 검수가 필요한 경우

- 개발 모드에서는 테스트 사용자만 사용 가능
- 실제 사용자 연동을 위해서는 앱 검수 필수

### Business 계정으로 전환할 수 없는 경우

- Facebook 페이지가 필요
- Instagram 프로필을 Business 또는 Creator로 전환

### API 호출 오류

- Access Token 유효성 확인
- 권한 설정 확인
- Rate Limit 초과 확인

---

이제 Backend에서 OAuth를 구현하고, Frontend에서 연동하면 실제 Instagram 데이터를 가져올 수 있습니다! 🚀

