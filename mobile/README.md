# SmartProfileLink Mobile App

Flutter 기반 모바일 앱입니다.

## 🚀 시작하기

### 설치

```bash
flutter pub get
```

### iOS 설정 (macOS만)

```bash
cd ios
pod install
cd ..
```

### 개발 서버 실행

```bash
flutter run
```

또는 특정 디바이스 지정:

```bash
flutter run -d <device-id>
```

사용 가능한 디바이스 확인:

```bash
flutter devices
```

## 🏗️ 프로젝트 구조

```
lib/
├── core/
│   ├── router/          # 라우팅 (go_router)
│   ├── theme/           # 앱 테마
│   ├── services/        # API 서비스 (Dio)
│   └── constants/       # 상수
│
└── features/
    ├── auth/            # 인증
    ├── home/            # 메인 대시보드
    ├── sns/             # SNS 연동
    ├── profile/         # 프로필
    ├── price/           # 단가 계산기
    ├── proposal/        # 제안서 생성
    ├── brand/           # 브랜드 문의
    └── settings/        # 설정
```

## 📦 주요 패키지

- **flutter_riverpod**: 상태 관리
- **go_router**: 라우팅
- **dio**: HTTP 클라이언트
- **flutter_secure_storage**: 보안 저장소
- **in_app_purchase**: 인앱 결제

## 🏗️ 빌드

### Android

```bash
# APK
flutter build apk --release

# App Bundle
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## 🧪 테스트

```bash
flutter test
```

## 🔧 코드 생성

Riverpod 및 Retrofit 코드 생성:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

## ⚙️ API 설정

`lib/core/constants/api_constants.dart`에서 백엔드 서버 URL을 설정하세요:

```dart
static const String baseUrl = 'http://YOUR_SERVER_URL:3000';
```



