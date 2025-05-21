SELECT 
  'pair','open_time','open_price','high_price','low_price','close_price','base_vol','close_time','quote_vol','trade_count','tb_base_vol','tb_quote_vol','created_at','updated_at','deleted_at','deleted_yn'
UNION ALL
SELECT 
  pair,
  CONCAT('"', DATE_FORMAT(open_time, '%Y-%m-%d %H:%i:%s'), '"'),
  ROUND(open_price, 8),
  ROUND(high_price, 8),
  ROUND(low_price, 8),
  ROUND(close_price, 8),
  ROUND(base_vol, 8),
  CONCAT('"', DATE_FORMAT(close_time, '%Y-%m-%d %H:%i:%s'), '"'),
  ROUND(quote_vol, 8),
  trade_count,
  ROUND(tb_base_vol, 8),
  ROUND(tb_quote_vol, 8),
  CONCAT('"', DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s'), '"'),
  CONCAT('"', DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s'), '"'),
  IFNULL(CONCAT('"', DATE_FORMAT(deleted_at, '%Y-%m-%d %H:%i:%s'), '"'), 'NULL'),
  deleted_yn
INTO OUTFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/ohlcv_data.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY ''
LINES TERMINATED BY '\n'
FROM weathercoin.binance_ohlcv_1h;

SELECT 
  'gold_id','base_date','currency_code','item_name','price_krw','weight_kg','price_per_gram','price_per_ounce','price_per_kilogram','created_at','updated_at','deleted_at','deleted_yn'
UNION ALL
SELECT 
  gold_id,
  CONCAT('"', DATE_FORMAT(base_date, '%Y-%m-%d'), '"'),
  currency_code,
  item_name,
  price_krw,
  ROUND(weight_kg, 4),
  ROUND(price_per_gram, 4),
  ROUND(price_per_ounce, 4),
  ROUND(price_per_kilogram, 4),
  CONCAT('"', DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s'), '"'),
  CONCAT('"', DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s'), '"'),
  IFNULL(CONCAT('"', DATE_FORMAT(deleted_at, '%Y-%m-%d %H:%i:%s'), '"'), 'NULL'),
  deleted_yn
INTO OUTFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gold_price.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '' 
LINES TERMINATED BY '\n'
FROM weathercoin.gold_price;

SELECT 
  'rate_id','base_currency','target_currency','rate','rate_date','created_at','updated_at','deleted_at','deleted_yn'
UNION ALL
SELECT 
  rate_id,
  base_currency,
  target_currency,
  ROUND(rate, 8),
  CONCAT('"', DATE_FORMAT(rate_date, '%Y-%m-%d'), '"'),
  CONCAT('"', DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s'), '"'),
  CONCAT('"', DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s'), '"'),
  IFNULL(CONCAT('"', DATE_FORMAT(deleted_at, '%Y-%m-%d %H:%i:%s'), '"'), 'NULL'),
  deleted_yn
INTO OUTFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/exchange_rate.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '' 
LINES TERMINATED BY '\n'
FROM weathercoin.exchange_rate;

