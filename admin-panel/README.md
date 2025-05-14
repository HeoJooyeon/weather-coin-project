# 💼 관리자 페이지 기능 요약

## ⚠️ 주의: DB 설정

- `server/db/db.js` 파일 내에 MySQL 접속 정보가 하드코딩되어 있습니다.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1111
DB_NAME=weathercoin
DB_PORT=3306
```

---

## 🛠️ .env 환경 설정

- 운영환경에서는 `.env` 파일을 통해 민감 정보는 **절대 커밋하지 마세요**.

```env
PORT=5000
GOLD_API_KEY=GOLD_API_KEY
EXCHANGE_API_KEY=EXCHANGE_API_KEY
```

## 🔑 연동용 API 키 발급 안내

| 연동 대상                  | 키 발급 URL                                                                                                    | 비고 또는 서비스명                 | .env 키명              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------- |
| 바이낸스 API (시세, OHLCV) | [https://www.binance.com/en/my/settings/api-management](https://www.binance.com/en/my/settings/api-management) | 별도 키 없이 사용 가능             | (사용 안 함)           |
| 공공데이터포털 (금 시세)   | [https://www.data.go.kr](https://www.data.go.kr)                                                               | 금융위원회\_일반상품시세정보       | `GOLD_API_KEY=...`     |
| ExchangeRate.host (환율)   | [https://exchangerate.host](https://exchangerate.host)                                                         | 대시보드에서 확인 가능 (무료 사용) | `EXCHANGE_API_KEY=...` |

---

## 🚀 실행 방법

1. 백엔드 의존성 설치

```bash
cd server
npm install
```

2. 프론트엔드 의존성 설치

```bash
cd ../client
npm install
```

3. 루트로 돌아와서 백엔드 + 프론트엔드 동시 실행

```bash
cd ..
npm run start
```

---

## ✅ 1. 기간별 데이터 수집 기능 (OHLCV / 금 시세 / 환율)

- 프론트엔드에서 **시작일 ~ 종료일** 입력 시 아래 API 호출
- Express 서버에서 외부 API 요청 후 데이터를 가공하여 **MySQL DB에 저장**

| API 경로                  | 설명                                   |
| ------------------------- | -------------------------------------- |
| `POST /api/fetch-ohlcv`   | 바이낸스 OHLCV(1시간봉) 데이터 저장    |
| `POST /api/fetch-gold`    | 공공데이터포털 금 시세 저장 API        |
| `POST /api/exchange-rate` | ExchangeRate.host API를 통한 환율 저장 |

---

## ✅ 2. 코인마스터 정보 관리 기능

- `coin_master` 테이블을 기반으로 코인 정보를 **추가 / 수정 / 삭제** 가능
- 주요 관리 항목:
  - `name` (코인 이름, 예: 비트코인)
  - `symbol` (코인 심볼, 예: BTC)
  - `pair` (거래쌍, 예: BTCUSDT)
  - `logo_url` (로고 이미지 URL)
- **논리 삭제**(`deleted_yn`, `deleted_at`) 방식 사용
- 중복 거래쌍 방지를 위한 `UNIQUE KEY(pair)` 적용
- 추후 **거래소 API 연동을 통한 자동 갱신** 기능도 확장 고려 가능

---

## ✅ 3. 유저 정보 관리 기능

- 회원 정보를 **추가 / 수정 / 삭제 / (비밀번호 초기화)** 가능
- 비밀번호는 직접 수정하지 않으며, **초기화 버튼**을 통한 별도 처리 예정
- 추후 관리자 인증(JWT) 기능 연동 가능

---

## ✅ 4. 명령어 실행 기능

- 사용자 입력 CMD/Shell 명령어 실행 → 결과 출력
- `cd` 실행 시 디렉토리 상태 유지 (세션 지속)
- **기본 디렉토리 초기화 버튼** 지원 → 초기 경로로 복구 가능
