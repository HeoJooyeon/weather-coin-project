const mysql = require('mysql2');
const connection = require('../config/database');

// 연결
connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL 데이터베이스에 연결되었습니다.');
});

class CoinPrediction {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS coin_prediction (
                    predict_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '수익률 예측 PK',
                    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
                    predict_return DECIMAL(6,3) COMMENT '예측 수익률 (%)',
                    predict_return_7d DECIMAL(6,3) COMMENT '7일 후 예측 수익률 (%)',
                    predict_return_15d DECIMAL(6,3) COMMENT '15일 후 예측 수익률 (%)',
                    predict_return_30d DECIMAL(6,3) COMMENT '30일 후 예측 수익률 (%)',
                    predict_time DATETIME COMMENT '예측 기준 시간',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
                    INDEX idx_pair (pair)
                ) COMMENT = '코인 수익률 예측 결과'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('coin_prediction 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ pair, limit = 10 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM coin_prediction WHERE deleted_yn = "N"';
            const params = [];

            if (pair) {
                query += ' AND pair = ?';
                params.push(pair);
            }

            query += ' ORDER BY predict_time DESC LIMIT ?';
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

    static findOne({ predictId }) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_prediction WHERE predict_id = ? AND deleted_yn = "N"',
                [predictId],
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
CoinPrediction.initialize()
    .then(() => {
        console.log('coin_prediction 테이블 초기화 완료');
    })
    .catch(err => console.error('coin_prediction 테이블 초기화 실패:', err));

module.exports = CoinPrediction;
