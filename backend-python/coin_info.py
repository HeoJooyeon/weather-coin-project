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

def calculate_macd():

    connection = get_db_connection()     
    
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        from count_macd import count_macd_rate
        
        macd = count_macd_rate(df)
        
        return macd
    else:
        print("조회된 데이터가 없습니다.")
        return None
    
def calculate_sma():

    connection = get_db_connection()     
    
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        
        from count_sma import count_sma_rate
        
        sma = count_sma_rate(df)
        return sma
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
        

def coin_info_table(macd,sma,day, week, month):
    print(f"macd")
    print(macd)
    print(f"sma")
    print(sma)
    print(f"day, month, year")
    print(day["daily_change"], week["week_change"], month["month_change"])

if __name__ == "__main__":
    macd = calculate_macd()    
    sma = calculate_sma()
    day, week, month = calculate_change_rate()

    coin_info_table(macd,sma,day, week, month)
    
    