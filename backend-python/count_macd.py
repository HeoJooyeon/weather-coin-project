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


if __name__ == "__main__":    
    df = index()
    count_macd_rate(df)