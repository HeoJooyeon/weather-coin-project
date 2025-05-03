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

def index():

    connection = get_db_connection()     
    
    query = f"""
        SELECT * FROM binance_ohlcv_1h        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()    
    
    if not df.empty:
        from count_macd import count_macd_rate
        from count_sma import count_sma_rate
        macd = count_macd_rate(df)
        sma = count_sma_rate(df)
        return macd
    
if __name__ == "__main__":
    index()