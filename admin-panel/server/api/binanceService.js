const axios = require("axios");
const db = require("../db/db");

async function fetchAndStoreOHLCV(pair, startTime, endTime = Date.now()) {
  const limit = 1000;
  let start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  while (start < end) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&startTime=${start}&endTime=${end}&limit=${limit}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!Array.isArray(data) || data.length === 0) break;

    const insertValues = data.map((row) => [
      pair,
      new Date(row[0]),
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      new Date(row[6]),
      row[7],
      row[8],
      row[9],
      row[10],
    ]);

    const sql = `
      INSERT IGNORE INTO binance_ohlcv_1h
      (pair, open_time, open_price, high_price, low_price, close_price,
       base_vol, close_time, quote_vol, trade_count, tb_base_vol, tb_quote_vol)
      VALUES ?
    `;
    await db.query(sql, [insertValues]);

    // 다음 시작 시간 계산
    const lastTime = data[data.length - 1][0];
    if (data.length < limit) break;
    start = lastTime + 1;
  }
}

module.exports = { fetchAndStoreOHLCV };
