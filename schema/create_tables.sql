CREATE DATABASE IF NOT EXISTS binance;

USE binance;
DROP TABLE IF EXISTS coin_info;

/* 코인 종류 목록 (type 컬럼에 들어가는 값):
1. 비트코인 (Bitcoin)         - 심볼: BTC / 페어: BTCUSDT
2. 이더리움 (Ethereum)        - 심볼: ETH / 페어: ETHUSDT
3. 리플     (Ripple)          - 심볼: XRP / 페어: XRPUSDT
4. 바이낸스코인 (Binance Coin) - 심볼: BNB / 페어: BNBUSDT
5. 솔라나   (Solana)          - 심볼: SOL / 페어: SOLUSDT
6. 도지코인 (Dogecoin)        - 심볼: DOGE / 페어: DOGEUSDT
7. 카르다노 (Cardano)         - 심볼: ADA / 페어: ADAUSDT
8. 트론     (TRON)            - 심볼: TRX / 페어: TRXUSDT
9. 시바이누 (Shiba Inu)       - 심볼: SHIB / 페어: SHIBUSDT
10. 라이트코인 (Litecoin)     - 심볼: LTC / 페어: LTCUSDT
*/

-- 코인 기본 정보 테이블
CREATE TABLE coin_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '코인 고유 ID (내부 식별용)',
    name VARCHAR(50) NOT NULL COMMENT '코인 이름 (예: 비트코인)',
    symbol VARCHAR(20) NOT NULL COMMENT '코인 심볼 (예: BTC)',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
    change_24h DECIMAL(10,4) COMMENT '24시간 가격 변동률 (%)',
    change_7d DECIMAL(10,4) COMMENT '7일 가격 변동률 (%)',
    change_30d DECIMAL(10,4) COMMENT '30일 가격 변동률 (%)',
    weather_yesterday VARCHAR(20) COMMENT '어제 시장 상태 (맑음, 흐림 등)',
    weather_today VARCHAR(20) COMMENT '오늘 시장 상태',
    weather_tomorrow VARCHAR(20) COMMENT '예측된 내일 시장 상태',
    market_cap_rank INT COMMENT '시가총액 순위 (작을수록 상위)',
    logo_url VARCHAR(255) COMMENT '코인 로고 이미지 URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '코인 기본 정보 테이블';

-- 바이낸스 1시간봉 OHLCV 데이터 테이블
DROP TABLE IF EXISTS binance_ohlcv_1h;
CREATE TABLE binance_ohlcv_1h (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '바이낸스 코인 데이터 PK',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    open_time DATETIME NOT NULL COMMENT '시가 기준 시작 시간',
    open_price DECIMAL(20,8) NOT NULL COMMENT '시가 (가격, Open)',
    high_price DECIMAL(20,8) NOT NULL COMMENT '고가 (가격, High)',
    low_price DECIMAL(20,8) NOT NULL COMMENT '저가 (가격, Low)',
    close_price DECIMAL(20,8) NOT NULL COMMENT '종가 (가격, Close)',
    base_vol DECIMAL(20,8) NOT NULL COMMENT '코인 기준 거래량',
    close_time DATETIME NOT NULL COMMENT '종가 기준 종료 시간',
    quote_vol DECIMAL(20,8) COMMENT 'USDT 기준 거래량',
    trade_count INT COMMENT '거래 횟수',
    tb_base_vol DECIMAL(20,8) COMMENT '매수자 코인 거래량',
    tb_quote_vol DECIMAL(20,8) COMMENT '매수자 USDT 거래량',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '바이낸스 1시간봉 OHLCV 데이터 테이블';

-- 코인 스코어 테이블
DROP TABLE IF EXISTS coin_score;
CREATE TABLE coin_score (
    score_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '코인 스코어 PK',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    score_value DECIMAL(2,1) NOT NULL COMMENT '코인 스코어 (1.0 ~ 5.0)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    INDEX idx_pair (pair)
) COMMENT = '코인별 스코어 관리 테이블';

-- 회원 정보 테이블
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '로그인 ID',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호 (해시 저장)',
    nickname VARCHAR(50) NOT NULL COMMENT '별명 (표시 이름)',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '이메일 주소',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '회원 정보 테이블';

-- 종목토론 게시판 테이블
DROP TABLE IF EXISTS board_post;
CREATE TABLE board_post (
    post_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '게시판 글 PK',
    title VARCHAR(255) NOT NULL COMMENT '글 제목',
    content TEXT NOT NULL COMMENT '글 내용',
    writer_id BIGINT NOT NULL COMMENT '작성자 ID (users.id 참조)',
    view_count INT DEFAULT 0 COMMENT '조회수',
    likes INT DEFAULT 0 COMMENT '좋아요 수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '종목토론 게시판 테이블';

-- 종목토론 게시판 댓글 테이블
DROP TABLE IF EXISTS board_comment;
CREATE TABLE board_comment (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '게시판 댓글 PK',
    post_id BIGINT NOT NULL COMMENT '게시판 글 PK 참조',
    writer_id BIGINT NOT NULL COMMENT '댓글 작성자 ID (users.id 참조)',
    content TEXT NOT NULL COMMENT '댓글 내용',
    likes INT DEFAULT 0 COMMENT '좋아요 수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '종목토론 게시판 댓글 테이블';

-- 코인 관련 뉴스 테이블
DROP TABLE IF EXISTS coin_news;
CREATE TABLE coin_news (
    news_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '뉴스 PK',
    title VARCHAR(255) NOT NULL COMMENT '뉴스 제목',
    pair VARCHAR(20) COMMENT '거래쌍 (예: BTC/USDT)',
    symbol VARCHAR(20) COMMENT '심볼 (예: BTCUSDT)',
    content TEXT NOT NULL COMMENT '뉴스 내용',
    url VARCHAR(500) COMMENT '뉴스 원본 URL',
    publish_time DATETIME COMMENT '기사 발행 시각',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '코인 관련 뉴스 테이블';

-- 금 시세 정보 테이블
DROP TABLE IF EXISTS gold_price;
CREATE TABLE gold_price (
    gold_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '금 시세 PK',
    currency_code VARCHAR(10) NOT NULL COMMENT '통화 코드 (예: USD, KRW)',
    price_per_gram DECIMAL(20, 4) NOT NULL COMMENT '1그램당 금 가격',
    price_per_ounce DECIMAL(20, 4) COMMENT '1온스당 금 가격',
    price_per_kilogram DECIMAL(20, 4) COMMENT '1킬로그램당 금 가격',
    data_time DATETIME NOT NULL COMMENT '시세 기준 시각',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 수집 시각',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '금 시세 정보 테이블 (GoldPricez 기준)';

-- 환율 정보 테이블
DROP TABLE IF EXISTS exchange_rate;
CREATE TABLE exchange_rate (
    rate_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '환율 정보 PK',
    base_currency VARCHAR(10) NOT NULL COMMENT '기준 통화 (예: USD)',
    target_currency VARCHAR(10) NOT NULL COMMENT '대상 통화 (예: KRW)',
    rate DECIMAL(20, 8) NOT NULL COMMENT '환율 (1 기준통화 = rate 대상통화)',
    rate_date DATE NOT NULL COMMENT '환율 기준 날짜',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 수집 시각',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '환율 정보 테이블 (ExchangeRate.host 기준)';

-------------------------------------------------------------------------------
-- 여기서부터는 테이블 설계가 임시입니다.
-------------------------------------------------------------------------------
-- 회원 성향 분석 테이블
DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '성향 분석 PK',
    user_id BIGINT NOT NULL COMMENT '회원 ID (users.id 참조)',
    risk_type VARCHAR(20) COMMENT '성향 유형 (공격형, 안정형 등)',
    description TEXT COMMENT '성향 분석 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '회원 성향 분석 테이블';

-- 코인 기술적 지표 테이블
DROP TABLE IF EXISTS coin_indicator;
CREATE TABLE coin_indicator (
    indicator_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지표 테이블 PK',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    ma_5 DECIMAL(20,8) COMMENT '5일 이동평균 (MA)',
    ma_20 DECIMAL(20,8) COMMENT '20일 이동평균 (MA)',
    ema_5 DECIMAL(20,8) COMMENT '5일 지수이동평균 (EMA)',
    ema_20 DECIMAL(20,8) COMMENT '20일 지수이동평균 (EMA)',
    rsi DECIMAL(5,2) COMMENT '상대강도지수 (RSI)',
    macd DECIMAL(20,8) COMMENT 'MACD 값',
    macd_signal DECIMAL(20,8) COMMENT 'MACD 시그널 라인',
    macd_histogram DECIMAL(20,8) COMMENT 'MACD 히스토그램',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    INDEX idx_pair (pair)
) COMMENT = '코인 기술적 지표 저장 테이블 (테이블별 입력 순번 관리)';

-- 수익률 예측 테이블
DROP TABLE IF EXISTS coin_prediction;
CREATE TABLE coin_prediction (
    predict_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '수익률 예측 PK',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    predict_return DECIMAL(6,3) COMMENT '예측 수익률 (%)',
    predict_direction VARCHAR(10) COMMENT '예측 방향 (up/down)',
    rain_chance DECIMAL(5,2) COMMENT '비올 확률처럼 표현한 예측 신뢰도 (%)',
    predict_time DATETIME COMMENT '예측 기준 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    INDEX idx_pair (pair)
) COMMENT = '코인 수익률 예측 결과 (강수확률 형태)';

-- 시장 심리지수
DROP TABLE IF EXISTS market_sentiment;
CREATE TABLE market_sentiment (
    sentiment_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '시장 심리지수 PK',
    source VARCHAR(50) COMMENT '데이터 출처 (fear_greed 등)',
    score INT COMMENT '점수 (0~100)',
    emotion VARCHAR(20) COMMENT '감정 상태 (공포, 탐욕 등)',
    record_date DATE COMMENT '데이터 수집일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '시장 공포/탐욕 지수 테이블';

-- SNS 발언 테이블
DROP TABLE IF EXISTS sns_post;
CREATE TABLE sns_post (
    sns_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'SNS 발언 PK',
    platform VARCHAR(50) COMMENT '플랫폼 (twitter, X 등)',
    author VARCHAR(100) COMMENT '작성자 (ex: 일론머스크)',
    content TEXT COMMENT '발언 내용',
    url VARCHAR(500) COMMENT '링크',
    post_time DATETIME COMMENT '작성 시각',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
) COMMENT = '유명인 SNS 발언 테이블';
