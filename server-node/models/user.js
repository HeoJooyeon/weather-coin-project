const mysql = require('mysql2');
const connection = require('../config/database');

class User {
    // 테이블이 없으면 생성하는 정적 메서드
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS users (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                    \`userId\` VARCHAR(255) NOT NULL UNIQUE,
                    \`password\` VARCHAR(255) NOT NULL,
                    \`savedCoins\` TEXT,
                    \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
                    \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('users 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static async findOne({ where }) {
        return new Promise((resolve, reject) => {
            if (!connection) {
                reject(new Error('데이터베이스 연결이 없습니다.'));
                return;
            }

            connection.query(
                'SELECT * FROM users WHERE userId = ?',
                [where.userId],
                (err, results) => {
                    if (err) {
                        console.error('사용자 조회 오류:', err);
                        reject(err);
                        return;
                    }
                    // 결과가 없으면 null 반환
                    resolve(results && results.length > 0 ? results[0] : null);
                }
            );
        });
    }

    static async create(userData) {
        const { userId, password, savedCoins } = userData;

        return new Promise((resolve, reject) => {
            if (!connection) {
                reject(new Error('데이터베이스 연결이 없습니다.'));
                return;
            }

            connection.query(
                'INSERT INTO users (userId, password, savedCoins, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
                [userId, password, JSON.stringify(savedCoins || [])],
                (err, result) => {

                    if (err) {
                        console.error('사용자 생성 오류:', err);
                        reject(err);
                        return;
                    }

                    connection.query(
                        'SELECT * FROM users WHERE id = ?',
                        [result.insertId],
                        (err, newUser) => {
                            if (err) {
                                console.error('생성된 사용자 조회 오류:', err);
                                reject(err);
                                return;
                            }
                            // 결과가 없으면 null 반환
                            resolve(newUser && newUser.length > 0 ? this.formatUser(newUser[0]) : null);
                        }
                    );
                }
            );
        });
    }

    static formatUser(user) {
        if (!user) return null;

        return {
            id: user.id,
            userId: user.userId,
            password: user.password,
            savedCoins: user.savedCoins ? JSON.parse(user.savedCoins) : [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}

// 모듈 내보내기 전에 테이블 초기화
User.initialize()
    .then(() => {
        console.log('테이블 초기화 완료');
    })
    .catch(err => console.error('테이블 초기화 실패:', err));

module.exports = User; 