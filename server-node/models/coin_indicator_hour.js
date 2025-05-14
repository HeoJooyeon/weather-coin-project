const connection = require('../config/database');

class CoinIndicatorHour {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS coin_indicator_hour(
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
                ) COMMENT = '코인 기술적 지표 저장 테이블 (테이블별 입력 순번 관리)'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('coin_indicator_hour 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ pair, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM coin_indicator_hour WHERE deleted_yn = "N"';
            const params = [];

            if (pair) {
                query += ' AND pair = ?';
                params.push(pair);
            }

            query += ' ORDER BY created_at DESC LIMIT ?';
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

    static findOne({ indicatorId }) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_indicator_hour WHERE indicator_id = ? AND deleted_yn = "N"',
                [indicatorId],
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
CoinIndicatorHour.initialize()
    .then(() => {
        console.log('coin_indicator_hour 테이블 초기화 완료');
    })
    .catch(err => console.error('coin_indicator_hour 테이블 초기화 실패:', err));

module.exports = CoinIndicatorHour; 