const mysql = require("mysql2");

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "981021",
  database: "weathercoin",
  port: 3306,
};

// 데이터베이스 연결 생성
const connection = mysql.createConnection(dbConfig);

// 연결
connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 오류:", err);
    return;
  }
  console.log("MySQL 데이터베이스에 연결되었습니다.");
});

module.exports = connection;
