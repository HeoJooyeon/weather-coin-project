const connection = require('../config/database');

class ExchangeRate {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS exchange_rate (
                    rate_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '환율 정보 PK',
                    base_currency VARCHAR(10) NOT NULL COMMENT '기준 통화 (예: USD)',
                    target_currency VARCHAR(10) NOT NULL COMMENT '대상 통화 (예: KRW)',
                    rate DECIMAL(20, 8) NOT NULL COMMENT '환율 (1 기준통화 = rate 대상통화)',
                    rate_date DATE NOT NULL COMMENT '환율 기준 날짜',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 수집 시각',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
                ) COMMENT = '환율 정보 테이블 (ExchangeRate.host 기준)'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('exchange_rate 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ baseCurrency, targetCurrency, startDate, endDate, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM exchange_rate WHERE deleted_yn = "N"';
            const params = [];

            if (baseCurrency) {
                query += ' AND base_currency = ?';
                params.push(baseCurrency);
            }

            if (targetCurrency) {
                query += ' AND target_currency = ?';
                params.push(targetCurrency);
            }

            if (startDate) {
                query += ' AND rate_date >= ?';
                params.push(startDate);
            }

            if (endDate) {
                query += ' AND rate_date <= ?';
                params.push(endDate);
            }

            query += ' ORDER BY rate_date DESC LIMIT ?';
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

    static findOne(rateId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM exchange_rate WHERE rate_id = ? AND deleted_yn = "N"',
                [rateId],
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

    static findByCurrencies(baseCurrency, targetCurrency, rateDate) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM exchange_rate WHERE base_currency = ? AND target_currency = ? AND rate_date = ? AND deleted_yn = "N"',
                [baseCurrency, targetCurrency, rateDate],
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

    static create(rateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO exchange_rate SET ?',
                rateData,
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...rateData });
                }
            );
        });
    }

    static update(rateId, updateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE exchange_rate SET ? WHERE rate_id = ?',
                [updateData, rateId],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.affectedRows > 0);
                }
            );
        });
    }

    static delete(rateId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE exchange_rate SET deleted_yn = "Y", deleted_at = NOW() WHERE rate_id = ?',
                [rateId],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result.affectedRows > 0);
                }
            );
        });
    }
}

// 모듈 내보내기 전에 테이블 초기화
ExchangeRate.initialize()
    .then(() => {
        console.log('exchange_rate 테이블 초기화 완료');
    })
    .catch(err => console.error('exchange_rate 테이블 초기화 실패:', err));

module.exports = ExchangeRate; 