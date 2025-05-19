const mysql = require("mysql2");
const connection = require("../config/database"); // DB 연결 설정

class User {
  static async initialize() {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          nickname VARCHAR(50),
          email VARCHAR(100) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;

      connection.query(query, (err, result) => {
        if (err) {
          console.error("테이블 생성 오류:", err);
          reject(err);
        } else {
          console.log("users 테이블 확인/생성 완료");
          resolve(result);
        }
      });
    });
  }

  static async findOne(param) {
    return new Promise((resolve, reject) => {
      const queryField = "email";
      const queryValue = param.where.userId;

      if (!queryValue) {
        return reject(new Error("조회할 사용자 이메일이 제공되지 않았습니다."));
      }

      connection.query(
        `SELECT * FROM users WHERE ${queryField} = ?`,
        [queryValue],
        (err, results) => {
          if (err) {
            console.error("사용자 조회 오류:", err);
            reject(err);
            return;
          }
          // formatUser 제거: 로그인 시 password를 사용하기 위해 원본 객체를 반환
          resolve(results && results.length > 0 ? results[0] : null);
        },
      );
    });
  }

  static async create(userData) {
    const { username, password, email, nickname } = userData;

    return new Promise((resolve, reject) => {
      if (!connection) {
        return reject(new Error("데이터베이스 연결이 없습니다."));
      }

      if (!username) {
        return reject(new Error("사용자 이름(username)은 필수 항목입니다."));
      }
      if (!password) {
        return reject(new Error("비밀번호는 필수 항목입니다."));
      }
      if (!email) {
        return reject(new Error("이메일은 필수 항목입니다."));
      }

      const insertQuery = `
        INSERT INTO users (username, password, email, nickname, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      const queryParams = [username, password, email, nickname || null];

      connection.query(insertQuery, queryParams, (err, result) => {
        if (err) {
          console.error("사용자 생성 오류:", err);
          if (err.code === "ER_DUP_ENTRY") {
            if (err.message.includes("username")) {
              return reject(new Error("이미 사용 중인 사용자 이름입니다."));
            } else if (err.message.includes("email")) {
              return reject(new Error("이미 사용 중인 이메일입니다."));
            }
            return reject(new Error("이미 사용 중인 값이 있습니다."));
          }
          if (err.code === "ER_BAD_NULL_ERROR") {
            return reject(
              new Error(`필수 항목이 누락되었습니다: ${err.sqlMessage}`),
            );
          }
          reject(err);
          return;
        }

        connection.query(
          "SELECT * FROM users WHERE id = ?",
          [result.insertId],
          (err, newUserRows) => {
            if (err) {
              console.error("생성된 사용자 조회 오류:", err);
              reject(err);
              return;
            }
            resolve(
              newUserRows && newUserRows.length > 0
                ? this.formatUser(newUserRows[0])
                : null,
            );
          },
        );
      });
    });
  }

  static formatUser(user) {
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

User.initialize()
  .then(() => console.log("User 모델: 테이블 초기화 완료."))
  .catch((err) => console.error("User 모델: 테이블 초기화 실패:", err));

module.exports = User;
