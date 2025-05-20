CREATE DATABASE IF NOT EXISTS weathercoin;

USE weathercoin;

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

-- 일배치 테이블
DROP TABLE IF EXISTS coin_past_info;
CREATE TABLE coin_past_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '기본키',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 (예: BTCUSDT)',
    open_date DATE NOT NULL COMMENT '기준 날짜 (일 단위)',
    current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
    change_24h DECIMAL(10,4) COMMENT '24시간 가격 변동률 (%)',
    change_3Y DECIMAL(10,4) COMMENT '3년전 가격 변동률 (%)',
    change_2Y DECIMAL(10,4) COMMENT '2년전 가격 변동률 (%)',
    change_1Y DECIMAL(10,4) COMMENT '1년전 가격 변동률 (%)',
    market_cap_rank INT COMMENT '시가총액 순위',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부',
    UNIQUE KEY uq_pair_date (pair, open_date)
) COMMENT = '코인 일배치 정보 테이블';

-- 코인 기술적 지표 테이블_일별
DROP TABLE IF EXISTS coin_indicator_day;
CREATE TABLE coin_indicator_day(
    indicator_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지표 테이블 PK',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    open_time DATETIME NOT NULL COMMENT '시가 기준 시작 시간(당일 00시)',
    ma_5D DECIMAL(20,8) COMMENT '5일 이동평균 (MA)',
    ma_20D DECIMAL(20,8) COMMENT '20일 이동평균 (MA)',
    ema_5D DECIMAL(20,8) COMMENT '5일 지수이동평균 (EMA)',
    ema_20D DECIMAL(20,8) COMMENT '20일 지수이동평균 (EMA)',
    rsi_day DECIMAL(5,2) COMMENT '상대강도지수 (RSI)',
    macd_day DECIMAL(20,8) COMMENT 'MACD 값',
    macd_signal_day DECIMAL(20,8) COMMENT 'MACD 시그널 라인',
    macd_histogram_day DECIMAL(20,8) COMMENT 'MACD 히스토그램',
    score INT DEFAULT NULL COMMENT '기술지표 기반 스코어 (1~5)',
    w_icon VARCHAR(10) COMMENT '날씨 아이콘',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    INDEX idx_pair (pair)
) COMMENT = '코인 기술적 지표 저장 테이블 (테이블별 입력 순번 관리)';

-- 코인 기술적 지표 테이블_시간별
DROP TABLE IF EXISTS coin_indicator_hour; 
CREATE TABLE coin_indicator_hour(
    indicator_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지표 테이블 PK',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    ma_5H DECIMAL(20,8) COMMENT '5시간 이동평균 (MA)',
    ma_20H DECIMAL(20,8) COMMENT '20시간 이동평균 (MA)',
    ema_5H DECIMAL(20,8) COMMENT '5시간 지수이동평균 (EMA)',
    ema_20H DECIMAL(20,8) COMMENT '20시간 지수이동평균 (EMA)',
    rsi_hour DECIMAL(5,2) COMMENT '상대강도지수 (RSI)',
    macd_hour DECIMAL(20,8) COMMENT 'MACD 값',
    macd_signal_hour DECIMAL(20,8) COMMENT 'MACD 시그널 라인',
    macd_histogram_hour DECIMAL(20,8) COMMENT 'MACD 히스토그램',   
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
    current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
    predict_return_7d DECIMAL(6,3) COMMENT '7일 후 예측 수익률 (%)',
    predict_return_15d DECIMAL(6,3) COMMENT '15일 후 예측 수익률 (%)',
    predict_return_30d DECIMAL(6,3) COMMENT '30일 후 예측 수익률 (%)',
    predict_time DATETIME COMMENT '예측 기준 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    INDEX idx_pair (pair)
) COMMENT = '코인 수익률 예측 결과';

-- 코인 기본 마스터 정보 테이블
DROP TABLE IF EXISTS coin_master;
CREATE TABLE coin_master (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '코인 고유 ID',
    name VARCHAR(50) NOT NULL COMMENT '코인 이름 (예: 비트코인)',
    symbol VARCHAR(20) NOT NULL COMMENT '코인 심볼 (예: BTC)',
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    logo_url VARCHAR(255) COMMENT '코인 로고 이미지 URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부',
    UNIQUE KEY uq_pair (pair)
) COMMENT = '코인 기본 마스터 정보 테이블';

-- 바이낸스 1시간봉 OHLCV 데이터 테이블
DROP TABLE IF EXISTS binance_ohlcv_1h;
CREATE TABLE binance_ohlcv_1h (
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
    open_time DATETIME NOT NULL COMMENT '시가 기준 시작 시간',
    open_price DECIMAL(20,8) COMMENT '시가 (가격, Open)',
    high_price DECIMAL(20,8) COMMENT '고가 (가격, High)',
    low_price DECIMAL(20,8) COMMENT '저가 (가격, Low)',
    close_price DECIMAL(20,8) COMMENT '종가 (가격, Close)',
    base_vol DECIMAL(20,8) COMMENT '코인 기준 거래량',
    close_time DATETIME COMMENT '종가 기준 종료 시간',
    quote_vol DECIMAL(20,8) COMMENT 'USDT 기준 거래량',
    trade_count INT COMMENT '거래 횟수',
    tb_base_vol DECIMAL(20,8) COMMENT '매수자 코인 거래량',
    tb_quote_vol DECIMAL(20,8) COMMENT '매수자 USDT 거래량',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    PRIMARY KEY (pair, open_time)
) COMMENT = '바이낸스 1시간봉 OHLCV 데이터 테이블';

-- 회원 정보 테이블
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '로그인 ID',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호 (해시 저장)',
    nickname VARCHAR(50) COMMENT '별명 (표시 이름)',
    email VARCHAR(100) COMMENT '이메일 주소',
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
    content TEXT COMMENT '글 내용',
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
    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 (예: BTCUSDT)',
    symbol VARCHAR(20) COMMENT '코인 심볼 (예: BTC)',
    content TEXT COMMENT '뉴스 내용',
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
    base_date DATE NOT NULL COMMENT '기준일자',
    currency_code VARCHAR(10) NOT NULL COMMENT '통화 코드 (예: USD, KRW)',
    item_name VARCHAR(100) COMMENT '금 상품명 (예: 금 99.99_1Kg)',
    price_krw INT COMMENT '종가 (원 단위)',
    weight_kg DECIMAL(10,4) COMMENT '무게 (kg)',
    price_per_gram DECIMAL(20,4) COMMENT '그램당 환산 가격',
    price_per_ounce DECIMAL(20,4) COMMENT '온스당 환산 가격',
    price_per_kilogram DECIMAL(20, 4) COMMENT '킬로그램당 환산산 가격',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 수집 시각',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
	deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
    UNIQUE KEY uq_item_date (item_name, base_date)
) COMMENT = '공공데이터포털 금 시세 테이블';

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
