// const mysql = require("mysql2");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mysql = require("mysql2");

console.log("DB_HOST:", process.env.DB_HOST);

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
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
