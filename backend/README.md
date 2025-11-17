# SmartProfileLink Backend API

NestJS 기반 백엔드 API 서버입니다.

## 🚀 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

### 데이터베이스 설정

```bash
# Prisma 마이그레이션
npx prisma migrate dev

# Prisma Client 생성
npx prisma generate

# Prisma Studio 실행 (데이터베이스 GUI)
npx prisma studio
```

### 개발 서버 실행

```bash
npm run start:dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### API 문서

Swagger 문서는 `http://localhost:3000/api`에서 확인할 수 있습니다.

## 📚 주요 모듈

- **Auth**: JWT 인증 및 회원가입/로그인
- **User**: 사용자 프로필 관리
- **SNS**: Instagram, YouTube, TikTok 연동
- **Price**: 광고 단가 자동 계산
- **Proposal**: PDF 제안서 생성
- **Brand**: 브랜드 문의 관리
- **Profile**: 공개 프로필 링크

## 🧪 테스트

```bash
npm run test
```

## 🏗️ 빌드

```bash
npm run build
```

## 🚀 프로덕션 실행

```bash
npm run start:prod
```



