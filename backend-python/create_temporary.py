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
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        
        from count_rate import count_rate
        from count_rate import calculate_score
        
        coin_by_pair = count_rate(df)
        coin_score = calculate_score(coin_by_pair)
        return coin_score
    
    else:
        print("조회된 데이터가 없습니다.")
        return None   


def create_coin_info_table():    

    # 테이블 생성
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute(f"""
            CREATE TABLE coin_info_daily (
                id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '기본키',
                pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 (예: BTCUSDT)',
                open_date DATE NOT NULL COMMENT '기준 날짜 (일 단위)',
                current_price DECIMAL(20,8) COMMENT '현재 가격 (USDT 기준)',
                change_24h DECIMAL(10,4) COMMENT '24시간 가격 변동률 (%)',
                change_3Y DECIMAL(10,4) COMMENT '3년전 가격 변동률 (%)',

                change_2Y DECIMAL(10,4) COMMENT '2년전 가격 변동률 (%)',

                change_1Y DECIMAL(10,4) COMMENT '1년전 가격 변동률 (%)',
                weather_yesterday VARCHAR(20) COMMENT '어제 시장 상태(48시간전)',
                weather_today VARCHAR(20) COMMENT '오늘 시장 상태(24시간전)',
                weather_tomorrow VARCHAR(20) COMMENT '예측된 내일 시장 상태(당일 09시)',
                market_cap_rank INT COMMENT '시가총액 순위',
                score_value DECIMAL(2,1) COMMENT '코인 스코어 (1.0 ~ 5.0)',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 시간',
                deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '삭제 시간',
                deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부',
                UNIQUE KEY uq_pair_date (pair, open_date)
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
def input_coin_info(scores):      
        
    # score    
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        
        for coin_score in scores:
            pairs = coin_score["pair"]
            open_times = coin_score["open_time"]
            close_prices = coin_score["close_price"]
            scores = coin_score["score"]
            score_texts = coin_score["score_text"]
            
            for pair, open_time, close_prices, score, score_text in zip(pairs, open_times, close_prices, scores, score_texts):
                        
                cur.execute(f"""
                    INSERT INTO coin_info_temporary(pair,open_time,current_price,market_cap_rank,score_value,score_text,created_at,updated_at,deleted_at)
                    VALUES(%s,%s,%s,1,%s,%s,NOW(),NOW(),NOW())
                """,(pair,open_time,close_prices,score,score_text))
            
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
    scores = calculate_score()    
    input_coin_info(scores)
    
    
    
    
    