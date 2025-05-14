const connection = require('../config/database');

class GoldPrice {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS gold_price (
                    gold_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '금 시세 PK',
                    base_date DATE NOT NULL COMMENT '기준일자',
                    item_name VARCHAR(100) NOT NULL COMMENT '금 상품명 (예: 금 99.99_1Kg)',
                    price_krw INT NOT NULL COMMENT '종가 (원 단위)',
                    weight_kg DECIMAL(10,4) COMMENT '무게 (kg)',
                    price_per_gram DECIMAL(20,4) COMMENT '그램당 환산 가격',
                    price_per_ounce DECIMAL(20,4) COMMENT '온스당 환산 가격',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 수집 시각',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
                    UNIQUE KEY uq_item_date (item_name, base_date)
                ) COMMENT = '공공데이터포털 금 시세 테이블'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('gold_price 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ itemName, startDate, endDate, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM gold_price WHERE deleted_yn = "N"';
            const params = [];

            if (itemName) {
                query += ' AND item_name = ?';
                params.push(itemName);
            }

            if (startDate) {
                query += ' AND base_date >= ?';
                params.push(startDate);
            }

            if (endDate) {
                query += ' AND base_date <= ?';
                params.push(endDate);
            }

            query += ' ORDER BY base_date DESC LIMIT ?';
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

    static findOne(goldId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM gold_price WHERE gold_id = ? AND deleted_yn = "N"',
                [goldId],
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

    static findByItemAndDate(itemName, baseDate) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM gold_price WHERE item_name = ? AND base_date = ? AND deleted_yn = "N"',
                [itemName, baseDate],
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

    static create(goldData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO gold_price SET ?',
                goldData,
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...goldData });
                }
            );
        });
    }

    static update(goldId, updateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE gold_price SET ? WHERE gold_id = ?',
                [updateData, goldId],
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

    static delete(goldId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE gold_price SET deleted_yn = "Y", deleted_at = NOW() WHERE gold_id = ?',
                [goldId],
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
GoldPrice.initialize()
    .then(() => {
        console.log('gold_price 테이블 초기화 완료');
    })
    .catch(err => console.error('gold_price 테이블 초기화 실패:', err));

module.exports = GoldPrice; 