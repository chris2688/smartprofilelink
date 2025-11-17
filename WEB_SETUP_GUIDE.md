# 🌐 Flutter 웹(크롬) 실행 가이드

## 📋 사전 준비

### 1. Flutter 설치

Flutter가 설치되어 있지 않다면 먼저 설치해주세요:

**Windows:**
1. [Flutter SDK 다운로드](https://docs.flutter.dev/get-started/install/windows)
2. 압축 해제 (예: `C:\src\flutter`)
3. 환경 변수 PATH에 `C:\src\flutter\bin` 추가
4. PowerShell을 **재시작**

**설치 확인:**
```bash
flutter --version
```

---

## 🚀 웹 실행 방법

### 1단계: Flutter 웹 지원 활성화

```bash
flutter config --enable-web
```

### 2단계: 프로젝트 디렉토리로 이동

```bash
cd mobile
```

### 3단계: 의존성 설치

```bash
flutter pub get
```

### 4단계: 크롬에서 실행

```bash
# 기본 크롬 실행
flutter run -d chrome

# 또는 웹 서버 모드로 실행
flutter run -d web-server

# 특정 포트로 실행
flutter run -d web-server --web-port=8080
```

### 5단계: 브라우저 열기

앱이 자동으로 크롬에서 열립니다. 수동으로 열려면:

```
http://localhost:8080
```

---

## 🔧 빌드 (프로덕션)

### 웹 앱 빌드

```bash
flutter build web
```

빌드된 파일은 `mobile/build/web/` 폴더에 생성됩니다.

### 빌드된 앱 미리보기

```bash
cd build/web
python -m http.server 8080
# 또는
# npx serve
```

브라우저에서 `http://localhost:8080` 접속

---

## 📱 모바일 vs 웹 차이점

### 웹에서 지원되지 않는 기능
- 인앱 결제 (IAP)
- 특정 네이티브 기능
- 일부 플러그인

### 웹 대안
- IAP 대신 → Stripe, PayPal 등 웹 결제
- 로컬 알림 대신 → 웹 푸시 알림
- 로컬 저장소 → IndexedDB, LocalStorage

---

## 🐛 문제 해결

### 1. Flutter 명령어를 찾을 수 없음

```
flutter : 'flutter' is not recognized...
```

**해결 방법:**
- Flutter bin 폴더가 PATH에 추가되었는지 확인
- PowerShell 재시작
- `flutter doctor` 실행하여 설치 확인

### 2. CORS 오류

웹에서 백엔드 API 호출 시 CORS 오류가 발생할 수 있습니다.

**백엔드 수정 (backend/src/main.ts):**

```typescript
app.enableCors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
});
```

### 3. 웹 플랫폼이 활성화되지 않음

```bash
# 웹 플랫폼 확인
flutter devices

# 웹이 없으면 다시 활성화
flutter config --enable-web

# Flutter 캐시 새로고침
flutter doctor
```

---

## 💻 개발 팁

### 1. Hot Reload 사용

코드 수정 후 자동 새로고침:
```bash
flutter run -d chrome --hot
```

터미널에서 `r` 키 → Hot Reload
터미널에서 `R` 키 → Hot Restart

### 2. DevTools 사용

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

### 3. 디버그 모드 끄기

```bash
flutter run -d chrome --release
```

---

## 📝 빠른 명령어 모음

```bash
# 웹 지원 활성화
flutter config --enable-web

# 프로젝트 이동
cd mobile

# 의존성 설치
flutter pub get

# 크롬에서 실행
flutter run -d chrome

# 웹 서버로 실행
flutter run -d web-server --web-port=8080

# 프로덕션 빌드
flutter build web

# 사용 가능한 디바이스 확인
flutter devices
```

---

## 🌐 배포

### Netlify 배포

```bash
# 빌드
flutter build web

# netlify-cli 설치
npm install -g netlify-cli

# 배포
cd build/web
netlify deploy --prod
```

### Vercel 배포

```bash
# 빌드
flutter build web

# vercel-cli 설치
npm install -g vercel

# 배포
cd build/web
vercel --prod
```

### Firebase Hosting

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 초기화
firebase init hosting

# 빌드 디렉토리: build/web

# 배포
firebase deploy
```

---

## ✅ 웹 실행 체크리스트

- [ ] Flutter 설치 완료
- [ ] PATH 환경 변수 설정
- [ ] `flutter --version` 정상 실행
- [ ] `flutter config --enable-web` 실행
- [ ] `flutter pub get` 완료
- [ ] 백엔드 서버 실행 중 (http://localhost:3000)
- [ ] API baseUrl 설정 (api_constants.dart)
- [ ] CORS 설정 확인
- [ ] `flutter run -d chrome` 실행

---

## 🎉 완료!

이제 크롬에서 Flutter 앱을 실행할 수 있습니다!

```bash
cd mobile
flutter run -d chrome
```

**Happy Coding! 🚀**

