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

    
def calculate_score():

    connection = get_db_connection()     
    
    query = f"""
        SELECT * FROM coin_info_temporary        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        
        from change_rate import count_change_rate        
        
        coin_change_rate = count_change_rate(df)
        
        return coin_change_rate
    
    else:
        print("조회된 데이터가 없습니다.")
        return None   


def create_coin_info_table():    

    # 테이블 생성
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS coin_info_daily (
                id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '기본키',
                pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 (예: BTCUSDT)',
                open_time DATETIME NOT NULL COMMENT '기준 시간 (1시간 단위)',
                current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
                change_24h DECIMAL(10,4) COMMENT '24시간 가격 변동률 (%)',
                change_7d DECIMAL(10,4) COMMENT '7일 가격 변동률 (%)',
                change_30d DECIMAL(10,4) COMMENT '30일 가격 변동률 (%)',
                weather_yesterday VARCHAR(20) COMMENT '어제 시장 상태',
                weather_today VARCHAR(20) COMMENT '오늘 시장 상태',
                weather_tomorrow VARCHAR(20) COMMENT '예측된 내일 시장 상태',
                market_cap_rank INT COMMENT '시가총액 순위',
                score_value DECIMAL(2,1) COMMENT '코인 스코어 (1.0 ~ 5.0)',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
                deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '삭제 시간',
                deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부',
                UNIQUE KEY uq_pair_date (pair, open_time)
            ) COMMENT = '코인 일배치 정보 테이블';
        """)
        # table 생성 필요 없음
        connection.commit()
        print("테이블 생성 완료")
    
    except pymysql.MySQLError as e:
        print(f"테이블 생성 오류: {e}")

    finally:
        if connection:
            connection.close()    
def input_coin_info(coin_change_rate):      
        
    # score    
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        
        
        for coin_change in coin_change_rate:
            pair = coin_change["pair"].iloc[0]
            open_time = coin_change["open_time"].iloc[0]
            current_price = coin_change["current_price"].iloc[1]
            score = coin_change["score_value"].iloc[0]    
            day = coin_change["daily_change"].iloc[0]
            week = coin_change["week_change"].iloc[0]
            month = coin_change["month_change"].iloc[0]
            
            print(current_price)                  
            
            # cur.execute(f"""
            #     INSERT INTO coin_info_daily(pair,open_time,current_price,change_24h,change_7d,change_30d,weather_yesterday,weather_today,weather_tomorrow,market_cap_rank,score_value,created_at,updated_at,deleted_at)
            #     VALUES(%s,%s,%s,%s,%s,%s,"none","none","none",1,%s,NOW(),NOW(),NOW())
            # """,(pair,open_time,current_price,day,week,month,score))
            
        connection.commit()
        
        print("MySQL 저장 완료")
    except pymysql.MySQLError as e:
        print(f"데이터 삽입 오류: {e}")
    except Exception as e:
        print(f"기타 오류: {e}")
    
    finally:
        if connection:
            connection.close()
    

if __name__ == "__main__":
    create_coin_info_table()
    coin_change_rate = calculate_score()    
    input_coin_info(coin_change_rate)
    
    
    
    
    