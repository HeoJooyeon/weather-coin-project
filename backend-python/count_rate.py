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
 
def count_rate(df):
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]
    coin_results = []
    for coin in coins:
        
        coin_by_pair = df[df["pair"] == coin].sort_values("open_time")
        
        coin_by_pair.ta.sma(length=5, append=True)
        coin_by_pair.ta.ema(length=5, append=True)
        coin_by_pair.ta.rsi(length=14, append=True)
        coin_by_pair.ta.macd(close="close_price", fast=12, slow=26, signal=9, append=True)
        coin_by_pair = coin_by_pair.rename(columns={
            "SMA_5": "sma",
            "EMA_5": "ema",
            "RSI_14": "rsi",
            "MACD_12_26_9": "macd_line",
            "MACDh_12_26_9": "macd_signal",
            "MACDs_12_26_9": "macd_histogram"
        })
        coin_results.append(coin_by_pair)
    return coin_results
        # print(btc)
    
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
        latest_row = coin_pair.iloc[-1]
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
        sma_20 = ta.sma(coin_pair["close_price"], length=20).iloc[-1]
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


if __name__ == "__main__":    
    df = index()
    coin_by_pair = count_rate(df)
    coin_score = calculate_score(coin_by_pair)
    print(coin_score)
    