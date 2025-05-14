const connection = require('../config/database');

class CoinNews {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS coin_news (
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
                ) COMMENT = '코인 관련 뉴스 테이블'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('coin_news 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ symbol, pair, limit = 10 } = {}) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM coin_news WHERE deleted_yn = "N"';
            const params = [];

            if (symbol) {
                query += ' AND symbol = ?';
                params.push(symbol);
            }

            if (pair) {
                query += ' AND pair = ?';
                params.push(pair);
            }

            query += ' ORDER BY publish_time DESC LIMIT ?';
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

    static findOne(newsId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM coin_news WHERE news_id = ? AND deleted_yn = "N"',
                [newsId],
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

    static create(newsData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO coin_news SET ?',
                newsData,
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...newsData });
                }
            );
        });
    }

    static update(newsId, updateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE coin_news SET ? WHERE news_id = ?',
                [updateData, newsId],
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

    static delete(newsId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE coin_news SET deleted_yn = "Y", deleted_at = NOW() WHERE news_id = ?',
                [newsId],
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
CoinNews.initialize()
    .then(() => {
        console.log('coin_news 테이블 초기화 완료');
    })
    .catch(err => console.error('coin_news 테이블 초기화 실패:', err));

module.exports = CoinNews; 