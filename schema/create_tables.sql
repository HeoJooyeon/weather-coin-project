CREATE DATABASE IF NOT EXISTS binance;

USE binance;
-- 1. 비트코인 (BTCUSDT)
DROP TABLE IF EXISTS btc_usdt;
CREATE TABLE btc_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '비트코인 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '비트코인 (BTCUSDT) 1시간봉 데이터';

-- 2. 이더리움 (ETHUSDT)
DROP TABLE IF EXISTS eth_usdt;
CREATE TABLE eth_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '이더리움 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '이더리움 (ETHUSDT) 1시간봉 데이터';

-- 3. 리플 (XRPUSDT)
DROP TABLE IF EXISTS xrp_usdt;
CREATE TABLE xrp_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '리플 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '리플 (XRPUSDT) 1시간봉 데이터';

-- 4. 바이낸스코인 (BNBUSDT)
DROP TABLE IF EXISTS bnb_usdt;
CREATE TABLE bnb_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '바이낸스코인 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '바이낸스코인 (BNBUSDT) 1시간봉 데이터';

-- 5. 솔라나 (SOLUSDT)
DROP TABLE IF EXISTS sol_usdt;
CREATE TABLE sol_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '솔라나 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '솔라나 (SOLUSDT) 1시간봉 데이터';

-- 6. 도지코인 (DOGEUSDT)
DROP TABLE IF EXISTS doge_usdt;
CREATE TABLE doge_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '도지코인 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '도지코인 (DOGEUSDT) 1시간봉 데이터';

-- 7. 카르다노 (ADAUSDT)
DROP TABLE IF EXISTS ada_usdt;
CREATE TABLE ada_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '카르다노 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '카르다노 (ADAUSDT) 1시간봉 데이터';

-- 8. 트론 (TRXUSDT)
DROP TABLE IF EXISTS trx_usdt;
CREATE TABLE trx_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '트론 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '트론 (TRXUSDT) 1시간봉 데이터';

-- 9. 시바이누 (SHIBUSDT)
DROP TABLE IF EXISTS shib_usdt;
CREATE TABLE shib_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '시바이누 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '시바이누 (SHIBUSDT) 1시간봉 데이터';

-- 10. 라이트코인 (LTCUSDT)
DROP TABLE IF EXISTS ltc_usdt;
CREATE TABLE ltc_usdt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '라이트코인 테이블 PK',
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
) COMMENT = '라이트코인 (LTCUSDT) 1시간봉 데이터';

-- 11. 코인 스코어 테이블
DROP TABLE IF EXISTS coin_score;
CREATE TABLE coin_score (
    score_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '스코어 테이블 PK',
    ref_table VARCHAR(30) NOT NULL COMMENT '참조 테이블명 (코인 테이블)',
    ref_id BIGINT NOT NULL COMMENT '참조 테이블의 PK (id)',
    score_value DECIMAL(2,1) NOT NULL COMMENT '코인 스코어 (1.0 ~ 5.0)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '스코어 생성 일시',
    INDEX idx_ref_table_id (ref_table, ref_id)
) COMMENT = '코인별 스코어 관리 테이블';

-- 12. 게시판 테이블
DROP TABLE IF EXISTS board_post;
CREATE TABLE board_post (
    post_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '게시판 글 PK',
    title VARCHAR(255) NOT NULL COMMENT '글 제목',
    content TEXT NOT NULL COMMENT '글 내용',
    writer VARCHAR(50) NOT NULL COMMENT '작성자',
    view_count INT DEFAULT 0 COMMENT '조회수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시'
) COMMENT = '커뮤니티 게시판 글 테이블';

-- 13. 게시판 댓글 테이블
DROP TABLE IF EXISTS board_comment;
CREATE TABLE board_comment (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '게시판 댓글 PK',
    post_id BIGINT NOT NULL COMMENT '게시판 글 PK 참조',
    content TEXT NOT NULL COMMENT '댓글 내용',
    writer VARCHAR(50) NOT NULL COMMENT '댓글 작성자',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '댓글 작성 시간'
) COMMENT = '게시판 댓글 테이블';

-- 14. 뉴스 테이블
DROP TABLE IF EXISTS coin_news;
CREATE TABLE coin_news (
    news_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '뉴스 PK',
    title VARCHAR(255) NOT NULL COMMENT '뉴스 제목',
    content TEXT NOT NULL COMMENT '뉴스 내용',
    url VARCHAR(500) COMMENT '뉴스 원본 URL',
    publish_time DATETIME COMMENT '기사 발행 시각',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 등록 일시'
) COMMENT = '코인 관련 뉴스 데이터 테이블';

-- 15. 뉴스 댓글 테이블
DROP TABLE IF EXISTS news_comment;
CREATE TABLE news_comment (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '뉴스 댓글 PK',
    news_id BIGINT NOT NULL COMMENT '뉴스 글 PK 참조',
    content TEXT NOT NULL COMMENT '댓글 내용',
    writer VARCHAR(50) NOT NULL COMMENT '댓글 작성자',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '댓글 작성 시간'
) COMMENT = '뉴스 댓글 테이블';

-------------------------------------------------------------------------------
-- 여기서부터는 테이블 설계가 임시입니다.
-------------------------------------------------------------------------------
-- 16. 사용자 성향 분석 결과
DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '성향 분석 PK',
    session_id VARCHAR(100) NOT NULL COMMENT '비회원 세션 ID 또는 식별자',
    risk_type VARCHAR(20) COMMENT '성향 유형 (공격형, 안정형 등)',
    description TEXT COMMENT '성향 분석 설명',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '분석일시'
) COMMENT = '비회원 사용자 성향 분석 테이블';

-- 17. 코인 기술적 지표 테이블
DROP TABLE IF EXISTS coin_indicator;
CREATE TABLE coin_indicator (
    indicator_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지표 테이블 PK',
    ref_table VARCHAR(30) NOT NULL COMMENT '참조 테이블명 (코인 테이블)',
    ref_id BIGINT NOT NULL COMMENT '입력 순번 (테이블마다 별개로 증가)',
    ma_5 DECIMAL(20,8) COMMENT '5일 이동평균 (MA)',
    ma_20 DECIMAL(20,8) COMMENT '20일 이동평균 (MA)',
    ema_5 DECIMAL(20,8) COMMENT '5일 지수이동평균 (EMA)',
    ema_20 DECIMAL(20,8) COMMENT '20일 지수이동평균 (EMA)',
    rsi DECIMAL(5,2) COMMENT '상대강도지수 (RSI)',
    macd DECIMAL(20,8) COMMENT 'MACD 값',
    macd_signal DECIMAL(20,8) COMMENT 'MACD 시그널 라인',
    macd_histogram DECIMAL(20,8) COMMENT 'MACD 히스토그램',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '지표 생성 일시',
    UNIQUE KEY uq_ref_table_ref_id (ref_table, ref_id)
) COMMENT = '코인 기술적 지표 저장 테이블 (테이블별 입력 순번 관리)';

-- 18. 수익률 예측 테이블
DROP TABLE IF EXISTS coin_prediction;
CREATE TABLE coin_prediction (
    predict_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '수익률 예측 PK',
    ref_table VARCHAR(30) NOT NULL COMMENT '참조 테이블명 (코인 테이블)',
    ref_id BIGINT NOT NULL COMMENT '참조 테이블의 입력 순번',
    predict_return DECIMAL(6,3) COMMENT '예측 수익률 (%)',
    predict_direction VARCHAR(10) COMMENT '예측 방향 (up/down)',
    rain_chance DECIMAL(5,2) COMMENT '비올 확률처럼 표현한 예측 신뢰도 (%)',
    predict_time DATETIME COMMENT '예측 기준 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '예측 데이터 등록 일시',
    UNIQUE KEY uq_ref_table_ref_id (ref_table, ref_id)
) COMMENT = '코인 수익률 예측 결과 (강수확률 형태)';

-- 19. 시장 심리지수
DROP TABLE IF EXISTS market_sentiment;
CREATE TABLE market_sentiment (
    sentiment_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '시장 심리지수 PK',
    source VARCHAR(50) COMMENT '데이터 출처 (fear_greed 등)',
    score INT COMMENT '점수 (0~100)',
    emotion VARCHAR(20) COMMENT '감정 상태 (공포, 탐욕 등)',
    record_date DATE COMMENT '데이터 수집일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시'
) COMMENT = '시장 공포/탐욕 지수 테이블';

-- 20. 경고 알림 테이블
DROP TABLE IF EXISTS risk_alert;
CREATE TABLE risk_alert (
    alert_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '경고 알림 PK',
    ref_table VARCHAR(30) COMMENT '참조 테이블명 (코인 테이블)',
    ref_id BIGINT COMMENT '참조 id',
    alert_type VARCHAR(50) COMMENT '경고 유형 (가격폭락, 변동성 급증 등)',
    description TEXT COMMENT '경고 상세 설명',
    alert_time DATETIME COMMENT '경고 발생 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록 시간'
) COMMENT = '코인 관련 경고 알림 테이블';

-- 21. SNS 발언 테이블
DROP TABLE IF EXISTS sns_post;
CREATE TABLE sns_post (
    sns_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'SNS 발언 PK',
    platform VARCHAR(50) COMMENT '플랫폼 (twitter, X 등)',
    author VARCHAR(100) COMMENT '작성자 (ex: 일론머스크)',
    content TEXT COMMENT '발언 내용',
    url VARCHAR(500) COMMENT '링크',
    post_time DATETIME COMMENT '작성 시각',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록 시간'
) COMMENT = '유명인 SNS 발언 테이블';

-- 22. 외부 이벤트와 코인 가격 상관관계
DROP TABLE IF EXISTS event_correlation;
CREATE TABLE event_correlation (
    correlation_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '상관관계 PK',
    event_name VARCHAR(255) COMMENT '이벤트 이름 (ex: 금리인하 발표)',
    event_date DATE COMMENT '이벤트 발생일',
    coin_symbol VARCHAR(20) COMMENT '코인 심볼 (BTC, ETH 등)',
    price_change DECIMAL(6,3) COMMENT '등락률 (%)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일시'
) COMMENT = '외부 이벤트와 코인 가격 등락 상관관계 테이블';
