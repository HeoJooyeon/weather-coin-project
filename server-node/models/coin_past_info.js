const connection = require('../config/database');

class CoinPastInfo {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS coin_past_info (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '기본키',
                    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 (예: BTCUSDT)',
                    open_date DATE NOT NULL COMMENT '기준 날짜 (일 단위)',
                    current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
                    change_24h DECIMAL(10,4) COMMENT '24시간 가격 변동률 (%)',
                    change_3Y DECIMAL(10,4) COMMENT '3년전 가격 변동률 (%)',
                    change_2Y DECIMAL(10,4) COMMENT '2년전 가격 변동률 (%)',
                    change_1Y DECIMAL(10,4) COMMENT '1년전 가격 변동률 (%)',
                    weather_yesterday VARCHAR(20) COMMENT '어제 시장 상태(48시간전)',
                    weather_today VARCHAR(20) COMMENT '오늘 시장 상태(24시간전)',
                    weather_tomorrow VARCHAR(20) COMMENT '예측된 내일 시장 상태(당일 00시)',
                    market_cap_rank INT COMMENT '시가총액 순위', 
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부',
                    UNIQUE KEY uq_pair_date (pair, open_date)
                ) COMMENT = '코인 일배치 정보 테이블'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('coin_past_info 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ pair, startDate, endDate, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM coin_past_info WHERE deleted_yn = "N"';
            const params = [];

            if (pair) {
                query += ' AND pair = ?';
                params.push(pair);
            }

            if (startDate) {
                query += ' AND open_date >= ?';
                params.push(startDate);
            }

            if (endDate) {
                query += ' AND open_date <= ?';
                params.push(endDate);
            }

            query += ' ORDER BY open_date DESC LIMIT ?';
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

    static findOne({ id }) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_past_info WHERE id = ? AND deleted_yn = "N"',
                [id],
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
CoinPastInfo.initialize()
    .then(() => {
        console.log('coin_past_info 테이블 초기화 완료');
    })
    .catch(err => console.error('coin_past_info 테이블 초기화 실패:', err));

module.exports = CoinPastInfo; 