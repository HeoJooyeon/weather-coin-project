const connection = require('../config/database');

class BoardComment {
    static async initialize() {
        return new Promise((resolve, reject) => {
            const query = `
                CREATE TABLE IF NOT EXISTS board_comment (
                    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '게시판 댓글 PK',
                    post_id BIGINT NOT NULL COMMENT '게시판 글 PK 참조',
                    writer_id BIGINT NOT NULL COMMENT '댓글 작성자 ID (users.id 참조)',
                    content TEXT NOT NULL COMMENT '댓글 내용',
                    likes INT DEFAULT 0 COMMENT '좋아요 수',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)'
                ) COMMENT = '종목토론 게시판 댓글 테이블'
            `;

            connection.query(query, (err, result) => {
                if (err) {
                    console.error('테이블 생성 오류:', err);
                    reject(err);
                } else {
                    console.log('board_comment 테이블 확인/생성 완료');
                    resolve(result);
                }
            });
        });
    }

    static findByPostId(postId, { limit = 50, offset = 0 } = {}) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT * FROM board_comment 
                WHERE post_id = ? AND deleted_yn = "N" 
                ORDER BY created_at ASC 
                LIMIT ? OFFSET ?
            `;

            connection.query(query, [postId, limit, offset], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    static findOne(commentId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM board_comment WHERE comment_id = ? AND deleted_yn = "N"',
                [commentId],
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

    static create(commentData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO board_comment (post_id, writer_id, content) VALUES (?, ?, ?)',
                [commentData.post_id, commentData.writer_id, commentData.content],
                (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ id: result.insertId, ...commentData });
                }
            );
        });
    }

    static update(commentId, updateData) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE board_comment SET ? WHERE comment_id = ?',
                [updateData, commentId],
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

    static delete(commentId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'UPDATE board_comment SET deleted_yn = "Y", deleted_at = NOW() WHERE comment_id = ?',
                [commentId],
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
BoardComment.initialize()
    .then(() => {
        console.log('board_comment 테이블 초기화 완료');
    })
    .catch(err => console.error('board_comment 테이블 초기화 실패:', err));

module.exports = BoardComment; 