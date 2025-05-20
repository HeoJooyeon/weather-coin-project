const connection = require("../config/database");

class BinanceOHLCV {
  static async initialize() {
    return new Promise((resolve, reject) => {
      const query = `
                CREATE TABLE IF NOT EXISTS binance_ohlcv_1h (
                    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
                    open_time DATETIME NOT NULL COMMENT '시가 기준 시작 시간',
                    open_price DECIMAL(20,8) COMMENT '시가 (가격, Open)',
                    high_price DECIMAL(20,8) COMMENT '고가 (가격, High)',
                    low_price DECIMAL(20,8) COMMENT '저가 (가격, Low)',
                    close_price DECIMAL(20,8) COMMENT '종가 (가격, Close)',
                    base_vol DECIMAL(20,8) COMMENT '코인 기준 거래량',
                    close_time DATETIME COMMENT '종가 기준 종료 시간',
                    quote_vol DECIMAL(20,8) COMMENT 'USDT 기준 거래량',
                    trade_count INT COMMENT '거래 횟수',
                    tb_base_vol DECIMAL(20,8) COMMENT '매수자 코인 거래량',
                    tb_quote_vol DECIMAL(20,8) COMMENT '매수자 USDT 거래량',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                    deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                    deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
                    PRIMARY KEY (pair, open_time)
                ) COMMENT = '바이낸스 1시간봉 OHLCV 데이터 테이블'
            `;

      connection.query(query, (err, result) => {
        if (err) {
          console.error("테이블 생성 오류:", err);
          reject(err);
        } else {
          console.log("binance_ohlcv_1h 테이블 확인/생성 완료");
          resolve(result);
        }
      });
    });
  }

  static findAll({ pair, startTime, endTime, limit = 1000 } = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM binance_ohlcv_1h WHERE deleted_yn = "N"';
      const params = [];

      if (pair) {
        query += " AND pair = ?";
        params.push(pair);
      }

      if (startTime) {
        query += " AND open_time >= ?";
        params.push(startTime);
      }

      if (endTime) {
        query += " AND open_time <= ?";
        params.push(endTime);
      }

      query += " ORDER BY open_time DESC LIMIT ?";
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

  static findOne({ pair, openTime }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM binance_ohlcv_1h WHERE pair = ? AND open_time = ? AND deleted_yn = "N"',
        [pair, openTime],
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

  static create(ohlcvData) {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO binance_ohlcv_1h SET ?",
        ohlcvData,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ ...ohlcvData });
        }
      );
    });
  }

  static update(pair, openTime, updateData) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE binance_ohlcv_1h SET ? WHERE pair = ? AND open_time = ?",
        [updateData, pair, openTime],
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
BinanceOHLCV.initialize()
  .then(() => {
    console.log("binance_ohlcv_1h 테이블 초기화 완료");
  })
  .catch((err) => console.error("binance_ohlcv_1h 테이블 초기화 실패:", err));

module.exports = BinanceOHLCV;
