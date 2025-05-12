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
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()
    
    return df
# 변동률 예측
 
def fetch_count_rate(df):
    
    return 
    
    
def calculate_score(coin_by_pair):
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]
    score_lists = {}
    results = []
    score_mapping = {
        -2: "so bad",
        -1: "bad",
        0: "so so",
        1: "good",
        2: "so good",
    } 
    
    for coin_pair in coin_by_pair:
        score = 0
        latest_row = coin_pair.iloc[-1] # max로 바꿔보실?
        # rsi 조건
        rsi = latest_row["rsi"]
        # print(latest_row)   
        if rsi < 30:
            score += 1
        elif rsi > 70:
            score -= 1               
        
        # macd 조건
        macd_line = latest_row["macd_line"]
        macd_signal = latest_row["macd_signal"]    
                        
        if  macd_line > macd_signal:
            score += 1
        else:
            score -= 1
                        
         # sma 조건
        sma_20 = latest_row["sma_20"]
        sma_50 = ta.sma(coin_pair["close_price"], length=50).iloc[-1]
                
        if sma_20 > sma_50:
            score += 1
        else:
            score -= 1        

        pair = latest_row["pair"] 
        score_lists[pair] = score    
   
        coin_last = latest_row.to_frame().T
        coin_last["score"] = score
        
        coin_last["score_text"] = coin_last["score"].map(score_mapping)
        results.append(coin_last)
        
    return results

# def create_coin_skill_table():    

#     # 테이블 생성
#     try:
#         connection = get_db_connection()
#         cur = connection.cursor()
#         cur.execute(f"""
#             CREATE TABLE coin_indicator (
#                 indicator_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '지표 테이블 PK',
#                 pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
#                 ma_5 DECIMAL(20,8) COMMENT '5일 이동평균 (MA)',
#                 ma_20 DECIMAL(20,8) COMMENT '20일 이동평균 (MA)',
#                 ema_5 DECIMAL(20,8) COMMENT '5일 지수이동평균 (EMA)',
#                 ema_20 DECIMAL(20,8) COMMENT '20일 지수이동평균 (EMA)',
#                 rsi DECIMAL(5,2) COMMENT '상대강도지수 (RSI)',
#                 macd DECIMAL(20,8) COMMENT 'MACD 값',
#                 macd_signal DECIMAL(20,8) COMMENT 'MACD 시그널 라인',
#                 macd_histogram DECIMAL(20,8) COMMENT 'MACD 히스토그램',
#                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시',
#                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '데이터 수정 시간',
#                 deleted_at TIMESTAMP NULL DEFAULT NULL COMMENT '데이터 삭제 시간',
#                 deleted_yn CHAR(1) DEFAULT 'N' COMMENT '삭제 여부 (Y:삭제됨, N:정상)',
#                 INDEX idx_pair (pair)
#             ) COMMENT = '코인 기술적 지표 저장 테이블 (테이블별 입력 순번 관리)';
#         """)
#         # table 생성 필요 없음
#         connection.commit()
#         print("테이블 생성 완료")
    
#     except pymysql.MySQLError as e:
#         print(f"테이블 생성 오류: {e}")

#     finally:
#         if connection:
#             connection.close()

def input_coin_skill(coin_skills):      
        
    # score    
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        
        for coin_skill in coin_skills:
            pairs = coin_skill["pair"]
            sma_5s = coin_skill["sma_5"].fillna(0)
            sma_20s = coin_skill["sma_20"].fillna(0)
            ema_5s = coin_skill["ema_5"].fillna(0)
            ema_20s = coin_skill["ema_20"].fillna(0)
            rsis = coin_skill["rsi"].fillna(0)
            macd_lines = coin_skill["macd_line"].fillna(0)
            macd_signals = coin_skill["macd_signal"].fillna(0)
            macd_histograms = coin_skill["macd_histogram"].fillna(0)
            
            
            
            for pair, sma_5, sma_20, ema_5, ema_20, rsi, macd_line, macd_signal, macd_histogram in zip(pairs, sma_5s, sma_20s, ema_5s, ema_20s, rsis, macd_lines, macd_signals, macd_histograms):
                        
                cur.execute(f"""
                    INSERT INTO coin_indicator(pair,ma_5,ma_20,ema_5,ema_20,rsi,macd,macd_signal,macd_histogram,created_at,updated_at,deleted_at)
                    VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW(),NOW())
                """,(pair,sma_5,sma_20,ema_5,ema_20, rsi, macd_line, macd_signal, macd_histogram))
            
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
    df = index()
    coin_skills = count_rate(df)
    coin_score = calculate_score(coin_skills)
    input_coin_skill(coin_skills)
    # print("coin_skills",coin_skills)
    