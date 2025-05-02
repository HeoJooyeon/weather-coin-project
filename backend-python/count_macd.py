from flask import Flask, render_template, request
import pymysql
import pandas as pd
import pandas_ta as ta
import numpy as np
import os
from datetime import datetime, timedelta

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="981021",
        db="coin_info_db",
        charset="utf8mb4"
    )
    
def index():
    connection = get_db_connection()
    
    today = datetime.today()
    week_ago = today - timedelta(days=7)        
    
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()
    
    return df
    
def count_macd_rate(df):
    btc = df[df["pair"] == "BTC"].sort_values("open_time")
    btc_macd = btc.ta.macd(close="close_price", fast=12, slow=26, signal=9, append=True)
    """ btc["macd_line"] = btc_macd["MACD_12_26_9"]
    btc["macd_signal"] = btc_macd["MACDs_12_26_9"]
    btc["macd_histogram"] = btc_macd["MACDh_12_26_9"] """
    btc = btc.rename(columns={
        "MACD_12_26_9": "macd_line",
        "MACDs_12_26_9": "macd_signal",
        "MACDh_12_26_9": "macd_histogram"
    })
    print(btc["macd_line"].tail(50))

def create_table():
    connection = get_db_connection()
    cur = connection.cursor()
    try:
        cur.execute(f"""
                    CREATE TABLE coin_info (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '코인 고유 ID (내부 식별용)',
                        name VARCHAR(50) NOT NULL COMMENT '코인 이름 (예: 비트코인)',
                        symbol VARCHAR(20) NOT NULL COMMENT '코인 심볼 (예: BTC)',
                        pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
                        open_time DATETIME NOT NULL COMMENT '시가 기준 시작 시간',
                        current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
                        change_24h DECIMAL(10,4) COMMENT '24시간 가격 변동률 (%)',
                        change_7d DECIMAL(10,4) COMMENT '7일 가격 변동률 (%)',
                        change_30d DECIMAL(10,4) COMMENT '30일 가격 변동률 (%)',
                        weather_yesterday VARCHAR(20) COMMENT '어제 시장 상태 (맑음, 흐림 등)',
                        weather_today VARCHAR(20) COMMENT '오늘 시장 상태',
                        weather_tomorrow VARCHAR(20) COMMENT '예측된 내일 시장 상태',
                        market_cap_rank INT COMMENT '시가총액 순위 (작을수록 상위)',
                        logo_url VARCHAR(255) COMMENT '코인 로고 이미지 URL',
                        score_value DECIMAL(2,1) COMMENT '코인 스코어 (1.0 ~ 5.0)',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 시간',
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
                        deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
                        deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
                        UNIQUE KEY uq_pair_open_time (pair, open_time)
                    ) COMMENT = '코인 기본 정보 테이블';             
        """)
        connection.commit()
        print("테이블 생성 완료")
    except pymysql.MySQLError as e:
        print(f"테이블 생성 오류: {e}")
    finally:
        if connection:
            connection.close()
    
def fetch_coin_info():
    connection = get_db_connection()
    cur = connection.cursor()
    try:
        cur.execute(f"""
                    INSERT INTO coin_info(name, symbol, pair, open_time, current_price, change_24h, change_7d, change_30d, weather_yesterday, weather_today, weather_tomorrow, market_cap_rank, logo_url, score_value, created_at, updated_at, deleted_at)
                    VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW(), NOW())
        """), ()
        
    
if __name__ == "__main__":    
    df = index()
    count_macd_rate(df)