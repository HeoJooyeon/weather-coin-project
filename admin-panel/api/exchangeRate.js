// exchangeRate.js
const axios = require("axios");
const db = require("../db/db");
require("dotenv").config();

async function fetchAndStoreExchangeRates(startDate, endDate) {
  const url = `https://api.exchangerate.host/timeframe?access_key=${process.env.EXCHANGE_API_KEY}&source=USD&start_date=${startDate}&end_date=${endDate}`;

  const response = await axios.get(url);
  const quotesByDate = response.data?.quotes || {};

  const values = [];

  for (const date in quotesByDate) {
    const rates = quotesByDate[date];
    for (const pair in rates) {
      if (!pair.startsWith("USD")) continue;

      const target = pair.slice(3);
      values.push(["USD", target, rates[pair], date]);
    }
  }

  if (values.length > 0) {
    const sql = `
      INSERT IGNORE INTO exchange_rate 
      (base_currency, target_currency, rate, rate_date)
      VALUES ?`;
    await db.query(sql, [values]);
  }

  return values.length;
}

module.exports = { fetchAndStoreExchangeRates };
