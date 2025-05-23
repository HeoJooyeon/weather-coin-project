# weather-coin-project(🌤 매수하기 딱 좋은 날씨네?!!)

> _갈 때 가더라도 담배 한 대 정도는 괜찮잖아?_  
> 투자에도 "딱 좋은 날씨"가 있습니다.  
> 날씨처럼 직관적인 투자 보조 도구, 지금 시작합니다.

---

### ✅ 초기 실행 순서

1. .env 파일 환경 변수 설정
- DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT 등 구성

2. 스키마 생성
```bash
mysql -u [USER] -p [DB_NAME] < schema/create-tables/create_tables.sql
```

3. 초기 CSV 데이터 로딩
```bash
mysql -u [USER] -p [DB_NAME] < schema/csv-data/load_csv.sql
```

✅ 참고: 처음 실행 시 5년치 데이터를 불러오므로 약 10분 정도 소요될 수 있습니다.

---

## 🛠 프로젝트 실행 방법

### 1️⃣ 의존성 설치

```bash
npm install
```
- 루트에서 실행하면 하위 워크스페이스(client-react, admin-panel, server-node)의 package.json 의존성도 자동 설치됩니다.

### 2️⃣ concurrently 설치
```bash
npm install --save-dev concurrently
```

### 3️⃣ 전체 서버 일괄 실행
```bash
npm run start:all
```
- client-react, admin-panel, server-node, backend-python (python app.py)까지 한꺼번에 실행됩니다.



## 📌 프로젝트 개요

**"매수하기 딱 좋은 날씨네?!"**는  
기술적 지표와 감성 데이터를 기반으로 투자 판단을 도와주는  
**날씨 메타포 기반의 웹 서비스**입니다.

> ⭐ “복잡한 투자 정보, 날씨처럼 쉽게!”  
> ⭐ “지표가 맑다고 말할 때, 매수해보세요.”

---

## 🎯 핵심 목표

- 기술적 지표 기반 투자 점수 계산 및 시각화
- 날씨 컨셉(맑음~낙뢰)으로 시각적으로 직관화
- 초보 투자자도 쉽게 이해할 수 있는 UI/UX 제공

---

## 📊 주요 기능 및 요소

### 🔍 1. 전문성

- RSI, MACD, 이동평균선, 볼린저 밴드, 거래량, 시총, 감성분석 등 포함
- 정량화된 투자 지표들을 **점수화 및 시각화**

### 💡 2. 창의성

- 복잡한 지표를 **하나의 점수로 단순화**
- 날씨로 표현된 **투자 일기예보 UX**
- ⭐ 5단계 스코어 + 날씨 이모지 활용

| 점수       | 날씨         | 투자 시그널                   |
| ---------- | ------------ | ----------------------------- |
| ⭐⭐⭐⭐⭐ | ☀️ 맑음      | 긍정적 추세 지속, 변동성 낮음 |
| ⭐⭐⭐⭐   | ⛅ 구름 조금 | 우호적, 다소 조정 가능성      |
| ⭐⭐⭐     | ☁️ 흐림      | 중립, 관망 추천               |
| ⭐⭐       | 🌧 비         | 부정적 지표 다수, 주의        |
| ⭐         | ⛈ 낙뢰       | 급락 위험, 회피 권장          |

### 💎 3. 가치성

- 초보자에게도 쉽게 다가가는 투자 보조 도구
- 학습용 자료로도 사용 가능

### 🔥 4. 트렌드 반영

- AI 투자분석, UX 혁신, 시각화 중심의 최신 흐름 반영
- 자동화된 데이터 수집 및 예측 점수 반영

---

## 📈 분석 방식

- **기술지표 분석:** `pandas`, `ta` 라이브러리 기반
- **감성 분석:** 뉴스 기반 키워드 스코어링
- **이상 거래 탐지:** 거래량 급증, 고래 지갑 분석
- **예측 로직:** 시계열 기반 스코어링 알고리즘 + 실제 데이터 기반 보정

---

## 🧪 시각화 구성

- ⭐ 점수 + 날씨 이모지 UI
- 시계열 그래프, 선형/막대 차트, 추이 그래프 제공
- 예측값과 실제값 비교 가능하도록 시각화

---

## 👥 팀워크

- **역할 분담**

  - 데이터 수집 및 정제
  - 점수화 알고리즘 개발
  - 웹 시각화 및 UX 개발
  - 발표자료 및 문서 작성

- **협업 도구**

  - GitHub (버전 관리)
  - Notion (기획 및 일정 관리)

- **기술 스택**
  - Frontend: React
  - Backend: Node.js, FastAPI
  - 분석 및 처리: Python (Flask, pandas, matplotlib, beautifulsoup4 등)

---

## 🚀 향후 발전 방향

- 해외 지표(NASDAQ, 환율 등) 확대
- 사용자 맞춤형 포트폴리오 기능
- 푸시 알림 등 실시간 UX 기능 추가

---

## 🎤 슬로건 제안 (의견 주세요!)

> “당신의 투자, 날씨처럼 가볍게 판단하세요.”  
> “데이터가 맑다고 말할 때, 매수해보세요.”  
> “구름이 꼈다면? 오늘은 쉬는 것도 투자입니다.”  
> “거 매수형, 이거 장난이 너무 심한 것 아니오! 드루와 드루와~ 😂”

---
