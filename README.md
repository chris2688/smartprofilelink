# 🌟 SmartProfileLink - 인플루언서 스마트 프로필 링크 SaaS

## 📌 프로젝트 개요

**SmartProfileLink**는 인플루언서가 하나의 스마트 링크로 자신의 모든 SNS 채널을 연결하고, 광고주와 쉽게 협업할 수 있도록 돕는 올인원 SaaS 플랫폼입니다.

### 핵심 기능

- 🔗 **스마트 프로필 링크**: 하나의 URL로 모든 SNS 통합
- 📊 **자동 통계 분석**: Instagram, YouTube, TikTok 데이터 자동 수집
- 💰 **광고 단가 자동 계산**: AI 기반 정확한 단가 산정
- 📄 **자동 제안서 생성**: 버튼 하나로 PDF 제안서 생성
- 💼 **브랜드 문의 자동화**: 광고주가 직접 제안할 수 있는 문의 시스템
- 📈 **구독 기반 SaaS 모델**: Basic, Pro, Premium 플랜

---

## 🏗️ 기술 스택

### Backend
- **Node.js** + **NestJS** (TypeScript)
- **PostgreSQL** (데이터베이스)
- **Prisma ORM**
- **JWT** (인증)
- **Swagger** (API 문서)
- **Puppeteer** (PDF 생성)

### Mobile
- **Flutter 3.x** (Dart)
- **Riverpod** (상태관리)
- **go_router** (라우팅)
- **Dio** (HTTP 클라이언트)
- **In-App Purchase** (구독 결제)

### 연동 API
- Instagram Graph API
- YouTube Data API v3
- TikTok API for Business

---

## 📁 프로젝트 구조

```
smartprofilelink/
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── auth/              # 인증 모듈
│   │   ├── user/              # 사용자 관리
│   │   ├── sns/               # SNS 연동
│   │   ├── price/             # 광고 단가 계산
│   │   ├── proposal/          # 제안서 생성
│   │   ├── brand/             # 브랜드 문의
│   │   ├── profile/           # 공개 프로필
│   │   └── prisma/            # Prisma 설정
│   ├── prisma/
│   │   └── schema.prisma      # 데이터베이스 스키마
│   ├── package.json
│   └── .env.example
│
└── mobile/                     # Flutter 앱
    ├── lib/
    │   ├── core/
    │   │   ├── router/        # 라우팅
    │   │   ├── theme/         # 테마
    │   │   ├── services/      # API 서비스
    │   │   └── constants/     # 상수
    │   └── features/
    │       ├── auth/          # 인증 (온보딩, 로그인, 회원가입)
    │       ├── home/          # 메인 대시보드
    │       ├── sns/           # SNS 연동
    │       ├── profile/       # 프로필 미리보기
    │       ├── price/         # 단가 계산기
    │       ├── proposal/      # 제안서 생성
    │       ├── brand/         # 브랜드 문의함
    │       └── settings/      # 설정
    └── pubspec.yaml
```

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- PostgreSQL 14.x 이상
- Flutter 3.x
- Dart SDK 3.x

### 1. 백엔드 설정

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값들을 입력하세요

# Prisma 마이그레이션
npx prisma migrate dev

# Prisma Client 생성
npx prisma generate

# 개발 서버 실행
npm run start:dev
```

백엔드 서버가 `http://localhost:3000`에서 실행됩니다.
Swagger API 문서: `http://localhost:3000/api`

### 2. 모바일 앱 설정

```bash
cd mobile

# 의존성 설치
flutter pub get

# iOS 의존성 설치 (macOS만)
cd ios && pod install && cd ..

# 앱 실행 (개발 모드)
flutter run

# 또는 특정 디바이스 지정
flutter run -d <device-id>
```

---

## ⚙️ 환경 변수 설정

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/smartprofilelink"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_REFRESH_EXPIRES_IN="30d"

# SNS API Keys
INSTAGRAM_CLIENT_ID="your-instagram-client-id"
INSTAGRAM_CLIENT_SECRET="your-instagram-client-secret"
YOUTUBE_API_KEY="your-youtube-api-key"
TIKTOK_CLIENT_KEY="your-tiktok-client-key"
TIKTOK_CLIENT_SECRET="your-tiktok-client-secret"

# Storage (Supabase or AWS S3)
STORAGE_TYPE="supabase"
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"
SUPABASE_BUCKET="your-bucket-name"
```

### Mobile (lib/core/constants/api_constants.dart)

```dart
class ApiConstants {
  static const String baseUrl = 'http://YOUR_SERVER_URL:3000';
  // 실제 배포 시 서버 주소로 변경
}
```

---

## 📊 데이터베이스 스키마

주요 테이블:
- **User**: 인플루언서 사용자
- **SNSAccount**: 연동된 SNS 계정
- **SNSStats**: SNS 통계 데이터
- **PortfolioContent**: 포트폴리오 콘텐츠
- **Proposal**: 생성된 제안서
- **BrandRequest**: 브랜드 협업 문의
- **RefreshToken**: JWT 리프레시 토큰

자세한 스키마는 `backend/prisma/schema.prisma` 참고

---

## 🔑 주요 API 엔드포인트

### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신
- `GET /auth/me` - 현재 사용자 정보

### SNS 연동
- `POST /sns/connect` - SNS 계정 연동
- `GET /sns/stats/:platform` - SNS 통계 조회
- `GET /sns/portfolio` - 포트폴리오 조회

### 광고 단가
- `POST /price/calc` - 광고 단가 계산
- `POST /price/calc-all` - 모든 플랫폼 단가 계산

### 제안서
- `POST /proposal` - 제안서 생성
- `GET /proposal` - 내 제안서 목록
- `GET /proposal/:id` - 제안서 상세

### 브랜드 문의
- `POST /brand/request/:username` - 문의 생성 (Public)
- `GET /brand/requests` - 내 문의 목록
- `POST /brand/request/:id/accept` - 문의 승인
- `POST /brand/request/:id/reject` - 문의 거절

### 공개 프로필
- `GET /profile/:username` - 스마트 링크 조회 (Public)

---

## 📱 모바일 앱 화면

1. **온보딩** - 앱 소개 및 시작
2. **로그인/회원가입** - 인증
3. **메인 대시보드** - 통계 요약 및 빠른 작업
4. **SNS 연동** - Instagram, YouTube, TikTok 연동
5. **스마트 링크 미리보기** - 공개 프로필 확인
6. **광고 단가 계산기** - 자동 단가 산정
7. **제안서 생성** - PDF 제안서 자동 생성
8. **브랜드 문의함** - 협업 제안 관리
9. **설정** - 프로필, 구독, 앱 설정

---

## 💳 구독 플랜

### Free (무료)
- 30일 무료 사용
- 기본 기능 체험

### Basic (9,900원/월)
- 스마트 링크
- 기본 통계
- 단가 계산기

### Pro (19,900원/월)
- Basic 모든 기능
- 자동 제안서 생성
- 고급 통계 분석

### Premium (29,900원/월)
- Pro 모든 기능
- AI 콘텐츠 분석
- 우선 고객 지원
- 고급 템플릿

---

## 🔒 보안

- JWT 기반 인증
- Refresh Token 자동 갱신
- 비밀번호 bcrypt 해싱
- Flutter Secure Storage로 민감 정보 저장
- CORS 설정

---

## 🧪 테스트

### Backend
```bash
cd backend
npm run test
```

### Mobile
```bash
cd mobile
flutter test
```

---

## 📦 배포

### Backend (예: AWS EC2, Docker)
```bash
cd backend
npm run build
npm run start:prod
```

### Mobile
```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ios --release
```

---

## 🛠️ 개발 도구

- **Prisma Studio**: 데이터베이스 GUI
  ```bash
  cd backend
  npx prisma studio
  ```

- **Flutter DevTools**: 앱 디버깅
  ```bash
  flutter pub global activate devtools
  flutter pub global run devtools
  ```

---

## 📝 향후 계획

- [ ] 실시간 알림 (FCM)
- [ ] 채팅 기능
- [ ] AI 기반 콘텐츠 추천
- [ ] 분석 대시보드 고도화
- [ ] 웹 버전 개발

---

## 🤝 기여

이 프로젝트는 개인 프로젝트입니다. 
이슈나 제안사항이 있으시면 GitHub Issues를 이용해주세요.

---

## 📄 라이선스

이 프로젝트는 비공개 소스입니다.

---

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이메일로 연락주세요.

---

**Made with ❤️ for Influencers**



