const connection = require('../config/database');

class CoinMaster {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS coin_master (
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
                ) COMMENT = '코인 기본 마스터 정보 테이블'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('coin_master 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ name, symbol, pair, limit = 100 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM coin_master WHERE deleted_yn = "N"';
            const params = [];

            if (name) {
                query += ' AND name LIKE ?';
                params.push(`%${name}%`);
            }

            if (symbol) {
                query += ' AND symbol = ?';
                params.push(symbol);
            }

            if (pair) {
                query += ' AND pair = ?';
                params.push(pair);
            }

            query += ' ORDER BY id ASC LIMIT ?';
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

    static findOne(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_master WHERE id = ? AND deleted_yn = "N"',
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

    static findByPair(pair) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_master WHERE pair = ? AND deleted_yn = "N"',
                [pair],
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

    static findBySymbol(symbol) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_master WHERE symbol = ? AND deleted_yn = "N"',
                [symbol],
                (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                }
            );
        });
    }

    static create(coinData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO coin_master SET ?',
                coinData,
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...coinData });
                }
            );
        });
    }

    static update(id, updateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE coin_master SET ? WHERE id = ?',
                [updateData, id],
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

    static delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE coin_master SET deleted_yn = "Y", deleted_at = NOW() WHERE id = ?',
                [id],
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
CoinMaster.initialize()
    .then(() => {
        console.log('coin_master 테이블 초기화 완료');
    })
    .catch(err => console.error('coin_master 테이블 초기화 실패:', err));

module.exports = CoinMaster; 