# 🚀 Flutter 올바른 설치 방법

현재 Flutter SDK가 불완전하게 설치되어 있습니다. 다음 단계를 따라주세요:

## ✅ 올바른 설치 방법

### 1단계: 기존 폴더 삭제
```
C:\src\flutter 폴더를 완전히 삭제하세요
```

### 2단계: Flutter SDK 다운로드

**최신 안정 버전 다운로드:**
https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.5-stable.zip

또는 공식 사이트:
https://docs.flutter.dev/get-started/install/windows

### 3단계: 압축 해제
```
다운로드한 zip 파일을 C:\src 폴더에 압축 해제
결과: C:\src\flutter\
```

### 4단계: 환경 변수 추가

1. Windows 검색 → "환경 변수"
2. "시스템 환경 변수 편집" 클릭
3. "환경 변수" 버튼 클릭
4. 사용자 변수에서 "Path" 선택 → "편집"
5. "새로 만들기" 클릭
6. 입력: `C:\src\flutter\bin`
7. 확인 → 확인 → 확인

### 5단계: PowerShell 완전히 재시작

**중요!** 모든 PowerShell 창을 닫고 새로 열어야 합니다.

### 6단계: 설치 확인

새 PowerShell 창에서:
```powershell
flutter --version
flutter doctor
```

### 7단계: 웹 활성화 및 앱 실행

```powershell
flutter config --enable-web
cd C:\Users\seong\smartprofilelink\mobile
flutter pub get
flutter run -d chrome
```

---

## 🎯 빠른 대안: Scoop으로 자동 설치

더 쉬운 방법으로 Scoop 패키지 매니저를 사용할 수 있습니다:

### 1. Scoop 설치
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

### 2. Flutter 설치
```powershell
scoop bucket add extras
scoop install flutter
```

### 3. 확인
```powershell
flutter --version
```

---

## 📝 설치 후 체크리스트

- [ ] `C:\src\flutter` 폴더에 bin, packages 등의 폴더가 있음
- [ ] 환경 변수 PATH에 `C:\src\flutter\bin` 추가됨
- [ ] PowerShell 재시작함
- [ ] `flutter --version` 명령어가 정상 작동
- [ ] `flutter doctor` 실행 완료

설치가 완료되면 알려주세요! 🚀

