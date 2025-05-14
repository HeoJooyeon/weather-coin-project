const connection = require('../config/database');

class BoardPost {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS board_post (
                    post_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '게시판 글 PK',
                    title VARCHAR(255) NOT NULL COMMENT '글 제목',
                    content TEXT COMMENT '글 내용',
                    writer_id BIGINT NOT NULL COMMENT '작성자 ID (users.id 참조)',
                    view_count INT DEFAULT 0 COMMENT '조회수',
                    likes INT DEFAULT 0 COMMENT '좋아요 수',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
                ) COMMENT = '종목토론 게시판 테이블'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('board_post 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findAll({ limit = 20, offset = 0 } = {}) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM board_post 
                WHERE deleted_yn = "N" 
                ORDER BY created_at DESC 
                LIMIT ? OFFSET ?
            `;

            connection.query(query, [limit, offset], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    static findOne(postId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM board_post WHERE post_id = ? AND deleted_yn = "N"',
                [postId],
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

    static create(postData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO board_post (title, content, writer_id) VALUES (?, ?, ?)',
                [postData.title, postData.content, postData.writer_id],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...postData });
                }
            );
        });
    }

    static update(postId, updateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE board_post SET ? WHERE post_id = ?',
                [updateData, postId],
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

    static delete(postId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE board_post SET deleted_yn = "Y", deleted_at = NOW() WHERE post_id = ?',
                [postId],
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
BoardPost.initialize()
    .then(() => {
        console.log('board_post 테이블 초기화 완료');
    })
    .catch(err => console.error('board_post 테이블 초기화 실패:', err));

module.exports = BoardPost; 