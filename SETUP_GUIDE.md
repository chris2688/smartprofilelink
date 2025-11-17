# 🚀 SmartProfileLink 설치 가이드

이 문서는 SmartProfileLink 프로젝트를 처음부터 설정하고 실행하는 방법을 단계별로 안내합니다.

---

## 📋 사전 준비사항

### 필수 설치 항목

1. **Node.js** (v18 이상)
   - [https://nodejs.org](https://nodejs.org)에서 다운로드

2. **PostgreSQL** (v14 이상)
   - [https://www.postgresql.org](https://www.postgresql.org)에서 다운로드
   - 또는 Docker 사용:
     ```bash
     docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
     ```

3. **Flutter** (v3.x)
   - [https://flutter.dev](https://flutter.dev)에서 설치 가이드 참고

4. **Dart SDK** (Flutter와 함께 설치됨)

### 선택 사항

- **VS Code** 또는 **Android Studio** (Flutter 개발용)
- **Postman** 또는 **Insomnia** (API 테스트용)

---

## 🗄️ 1단계: 데이터베이스 설정

### PostgreSQL 데이터베이스 생성

```sql
CREATE DATABASE smartprofilelink;
```

또는 터미널에서:

```bash
psql -U postgres
CREATE DATABASE smartprofilelink;
\q
```

---

## 🔧 2단계: 백엔드 설정

### 1. 백엔드 디렉토리로 이동

```bash
cd backend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/smartprofilelink?schema=public"

# JWT (랜덤한 문자열로 변경하세요)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-min-32-characters-long"
JWT_REFRESH_EXPIRES_IN="30d"

# Server
PORT=3000
NODE_ENV=development

# SNS API Keys (나중에 설정)
INSTAGRAM_CLIENT_ID=""
INSTAGRAM_CLIENT_SECRET=""
YOUTUBE_API_KEY=""
TIKTOK_CLIENT_KEY=""
TIKTOK_CLIENT_SECRET=""

# Storage (나중에 설정)
STORAGE_TYPE="supabase"
SUPABASE_URL=""
SUPABASE_KEY=""
SUPABASE_BUCKET=""

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 4. Prisma 마이그레이션

```bash
npx prisma migrate dev --name init
```

### 5. Prisma Client 생성

```bash
npx prisma generate
```

### 6. 백엔드 서버 실행

```bash
npm run start:dev
```

서버가 정상적으로 실행되면 다음 메시지가 표시됩니다:

```
🚀 Server is running on http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api
```

### 7. API 테스트

브라우저에서 `http://localhost:3000/api`를 열어 Swagger 문서를 확인하세요.

---

## 📱 3단계: 모바일 앱 설정

### 1. 모바일 디렉토리로 이동

```bash
cd ../mobile
```

### 2. Flutter 의존성 설치

```bash
flutter pub get
```

### 3. iOS 의존성 설치 (macOS만)

```bash
cd ios
pod install
cd ..
```

### 4. API 서버 URL 설정

`lib/core/constants/api_constants.dart` 파일을 열고 다음과 같이 수정:

- **Android 에뮬레이터 사용 시**:
  ```dart
  static const String baseUrl = 'http://10.0.2.2:3000';
  ```

- **iOS 시뮬레이터 사용 시**:
  ```dart
  static const String baseUrl = 'http://localhost:3000';
  ```

- **실제 기기 사용 시**:
  ```dart
  static const String baseUrl = 'http://YOUR_LOCAL_IP:3000';
  // 예: 'http://192.168.0.100:3000'
  ```

### 5. 앱 실행

#### 사용 가능한 디바이스 확인

```bash
flutter devices
```

#### 특정 디바이스에서 실행

```bash
flutter run -d <device-id>
```

또는 그냥:

```bash
flutter run
```

---

## ✅ 4단계: 동작 확인

### 1. 회원가입 테스트

1. 앱 실행
2. 온보딩 화면에서 "시작하기" 클릭
3. 회원가입 정보 입력
4. 회원가입 완료 후 홈 화면 진입 확인

### 2. API 테스트

Swagger 문서(`http://localhost:3000/api`)에서 API를 직접 테스트할 수 있습니다.

---

## 🔍 문제 해결

### 백엔드 문제

#### 1. 데이터베이스 연결 오류

```
Error: P1001: Can't reach database server
```

**해결 방법**:
- PostgreSQL이 실행 중인지 확인
- DATABASE_URL이 올바른지 확인

#### 2. 포트 이미 사용 중

```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법**:
```bash
# 포트를 사용 중인 프로세스 종료 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# 또는 .env에서 PORT 변경
PORT=3001
```

### 모바일 앱 문제

#### 1. 의존성 오류

```bash
flutter pub upgrade
flutter clean
flutter pub get
```

#### 2. iOS 빌드 오류

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### 3. Android 빌드 오류

```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

#### 4. API 연결 오류

- 백엔드 서버가 실행 중인지 확인
- `api_constants.dart`의 baseUrl이 올바른지 확인
- 에뮬레이터/시뮬레이터에 따라 URL이 다름 (위 3단계 참고)

---

## 📚 다음 단계

### SNS API 연동 설정

실제 SNS 데이터를 수집하려면 다음 API 키가 필요합니다:

1. **Instagram Graph API**
   - [Meta for Developers](https://developers.facebook.com/)
   - 앱 생성 후 Instagram Graph API 활성화

2. **YouTube Data API v3**
   - [Google Cloud Console](https://console.cloud.google.com/)
   - API 및 서비스 > 사용 설정된 API > YouTube Data API v3

3. **TikTok API for Business**
   - [TikTok for Developers](https://developers.tiktok.com/)
   - 앱 등록 및 승인 필요

### Storage 설정 (Supabase 또는 AWS S3)

PDF 파일과 이미지 저장을 위한 스토리지 설정:

**Supabase (권장)**:
1. [Supabase](https://supabase.com/) 가입
2. 프로젝트 생성
3. Storage 버킷 생성
4. API 키 및 URL을 `.env`에 추가

**AWS S3**:
1. AWS 계정 생성
2. S3 버킷 생성
3. IAM 사용자 생성 및 권한 부여
4. 액세스 키를 `.env`에 추가

---

## 🎉 완료!

이제 SmartProfileLink 앱을 사용할 준비가 되었습니다!

추가 질문이나 문제가 있으면 GitHub Issues를 활용해주세요.

---

**Happy Coding! 🚀**



