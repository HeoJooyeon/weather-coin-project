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
    
def count_sma_rate(df):
    btc = df[df["pair"] == "BTC"].sort_values("open_time")
    btc_sma = btc.ta.sma(length=14, append=True)
    btc = btc.rename(columns={
        "SMA_14": "btc_sma"
    })
    return btc

    
if __name__ == "__main__":    
    df = index()
    count_sma_rate(df)