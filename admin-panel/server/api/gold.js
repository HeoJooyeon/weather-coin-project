const axios = require("axios");
const db = require("../db/db");
const { format } = require("date-fns");

async function fetchAndStoreGoldPrices(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const resultData = [];

  while (start <= end) {
    const dateStr = format(start, "yyyyMMdd");
    const url = `https://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo?serviceKey=${process.env.GOLD_API_KEY}&basDt=${dateStr}&numOfRows=100&resultType=json`;

    try {
      const response = await axios.get(url);
      const items = response.data?.response?.body?.items?.item || [];

      for (const item of items) {
        const itemName = item.itmsNm;
        const price = parseInt(item.clpr);
        let weightKg = null;

        if (itemName.includes("1Kg")) {
          weightKg = 1;
        } else if (itemName.includes("100g")) {
          weightKg = 0.1;
        } else {
          continue;
        }

        const pricePerGram = price / (weightKg * 1000);
        const pricePerOunce = price / (weightKg * 31.1035);

        resultData.push([
          item.basDt,
          "KRW",
          itemName,
          price,
          weightKg,
          pricePerGram.toFixed(4),
          pricePerOunce.toFixed(4),
          price,
        ]);
      }
    } catch (err) {
      console.error(`[${dateStr}] 에러:`, err.message);
    }

    start.setDate(start.getDate() + 1);
  }

  if (resultData.length > 0) {
    const sql = `
      INSERT IGNORE INTO gold_price
      (base_date, currency_code, item_name, price_krw, weight_kg, price_per_gram, price_per_ounce, price_per_kilogram)
      VALUES ?
    `;
    await db.query(sql, [resultData]);
  }

  return resultData.length;
}

module.exports = { fetchAndStoreGoldPrices };
