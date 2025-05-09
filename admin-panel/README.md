# 💼 관리자 페이지 기능 요약

## ⚠️ 주의: DB 설정

- `db/db.js` 파일 내에 MySQL 접속 정보가 하드코딩되어 있습니다.
- 운영환경에서는 `.env` 파일을 통해 민감 정보는 **절대 커밋하지 마세요**.

예시 `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1111
DB_NAME=weathercoin
DB_PORT=3306
```

---

## 🛠️ .env 환경 설정

```env
PORT=5000
GOLD_API_KEY=GOLD_API_KEY
EXCHANGE_API_KEY=EXCHANGE_API_KEY
```

---

## 🚀 실행 방법

1. 프로젝트 루트에서 백엔드(Node.js) 의존성 설치

   ```bash
   npm install
   ```

2. 프론트엔드(`src/` 기준)로 이동하여 의존성 설치

   ```bash
   cd src
   npm install
   ```

3. React(포트 5000) + Express(포트 5001) 동시 실행

   ```bash
   cd ..
   npm run start
   ```

---

## ✅ 1. 기간별 데이터 수집 기능 (OHLCV / 금 시세 / 환율)

- 프론트엔드에서 **시작일 ~ 종료일** 입력 시 아래 API 호출
- Express 서버에서 외부 API 요청 후 데이터를 가공하여 **MySQL DB에 저장**

| API 경로                        | 설명                              |
|----------------------------------|-------------------------------------|
| `POST /api/fetch-ohlcv`         | 바이낸스 OHLCV(1시간봉) 데이터 저장 |
| `POST /api/fetch-gold`          | 한국금거래소 금 시세 저장          |
| `POST /api/exchange-rate`       | 환율 API 데이터 저장               |

---

## ✅ 2. 코인마스터 정보 관리 기능

- 등록된 코인마스터 정보를 **추가/수정/삭제** 가능
- 주요 항목: `코인 이름`, `심볼`, `상태`, `설명`
- 추후 **자동 연동 기능** 확장 고려 가능

---

## ✅ 3. 유저 정보 관리 기능

- **관리자 인증 기능 필요** (패스워드 또는 토큰 기반)
- 기본은 단일 관리자용, 추후 **다중 사용자 확장 고려 가능**
- 최소 인증 수준 → 추후 JWT 등으로 확장 가능

---
## ✅ 4. 명령어 실행 기능

- 사용자 입력 CMD/Shell 명령어 실행 → 결과 출력
- `cd` 실행 시 디렉토리 상태 유지 (세션 지속)
- **기본 디렉토리 초기화 버튼** 지원 → 초기 경로로 복구 가능

---