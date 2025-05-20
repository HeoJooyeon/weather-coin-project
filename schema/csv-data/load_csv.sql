LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/exchange_rate_5y.csv'
INTO TABLE weathercoin.exchange_rate
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gold_price_5y.csv'
INTO TABLE weathercoin.gold_price
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/ohlcv_data_5y.csv'
INTO TABLE weathercoin.binance_ohlcv_1h
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
