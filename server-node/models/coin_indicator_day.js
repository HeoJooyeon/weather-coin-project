const connection = require('../config/database');

class CoinIndicatorDay {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS coin_indicator_day(
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
                ) COMMENT = '코인 기술적 지표 저장 테이블 (테이블별 입력 순번 관리)'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('coin_indicator_day 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ pair, startTime, endTime, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM coin_indicator_day WHERE deleted_yn = "N"';
            const params = [];

            if (pair) {
                query += ' AND pair = ?';
                params.push(pair);
            }

            if (startTime) {
                query += ' AND open_time >= ?';
                params.push(startTime);
            }

            if (endTime) {
                query += ' AND open_time <= ?';
                params.push(endTime);
            }

            query += ' ORDER BY open_time DESC LIMIT ?';
            params.push(limit);

            connection.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    static findOne({ pair, openTime }) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_indicator_day WHERE pair = ? AND open_time = ? AND deleted_yn = "N"',
                [pair, openTime],
                (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results[0]);
                }
            );
        });
    }
}

// 모듈 내보내기 전에 테이블 초기화
CoinIndicatorDay.initialize()
    .then(() => {
        console.log('coin_indicator_day 테이블 초기화 완료');
    })
    .catch(err => console.error('coin_indicator_day 테이블 초기화 실패:', err));

module.exports = CoinIndicatorDay; 