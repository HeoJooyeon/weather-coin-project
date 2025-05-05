from flask import Flask
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


    
def import_count_rate():

    connection = get_db_connection()     
    
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        
        from count_rate import count_rate
        
        btc = count_rate(df)
        return btc
    else:
        print("조회된 데이터가 없습니다.")
        return None
    
def calculate_change_rate():

    connection = get_db_connection()     
    
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        
        from change_rate import count_change_rate
        
        day, week, month = count_change_rate(df)
        return day, week, month
    else:
        print("조회된 데이터가 없습니다.")
        return None
        

def create_coin_info_table(day, week, month, btc):    
    
    # print(f"btc")
    # print(btc)

    # 변동률률
    day_change = day["daily_change"]
    week_change = week["week_change"]
    month_change = month["month_change"]

    # 기술 지표
    btc_sma = btc["btc_sma"]
    btc_ema = btc["btc_ema"]
    btc_rsi = btc["btc_rsi"]
    btc_macd_line = btc["btc_macd_line"]
    btc_macd_signal = btc["btc_macd_signal"]
    btc_macd_histogram = btc["btc_macd_histogram"]

    # 테이블 생성
    try:
        connection = get_db_connection()
        cur = connection.cursor()
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

def input_coin_info():
    try:
        connection = get_db_connection()
        cur = connection.cursor()

        cur.execute(f"""
            INSERT INTO coin_info(name,symbol,pair,open_time,current_price,change_24h,change_7d,change_30d,weather_yesterday,weather_today,weather_tomorrow,market_cap_rank,logo_url,score_value,created_at,updated_at,deleted_at,deleted_yn)
            VALUES()
        """)
    

if __name__ == "__main__":    
    day, week, month = calculate_change_rate()
    btc = import_count_rate()

    create_coin_info_table(day, week, month, btc)
    
    