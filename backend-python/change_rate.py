from flask import Flask, render_template, request
import pymysql
import pandas as pd
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
    
def count_change_day_rate(df):
    today = datetime.today()
    yesterday = today - timedelta(days = 1)
    two_day_ago = today - timedelta(days = 2)
    week_ago = yesterday - timedelta(days=8)
    month_ago = datetime(today.year, today.month - 1, today.day)
    
    BTC = df[df["pair"] == "BTC"]    
    
    # 일 단위 변동률
    BTC["daily_change"] = BTC["close_price"].pct_change() * 100    
    
def count_change_rate(df):
    today = datetime.today()
    yesterday = today - timedelta(days = 1)
    two_day_ago = today - timedelta(days = 2)
    week_ago = yesterday - timedelta(days=8)
    month_ago = datetime(today.year, today.month - 1, today.day)
    
    BTC = df[df["pair"] == "BTC"]    
    
    # 일 단위 변동률
    BTC["daily_change"] = BTC["close_price"].pct_change() * 100
    # BTC_day_change = BTC["close_price"].pct_change() * 100
    # print(f"BTC_day_change:{BTC["daily_change"]}")
    
    # 주 단위 변동률
    BTC_group_by_week = BTC.groupby([BTC["open_time"].dt.year.rename("year"), BTC["open_time"].dt.isocalendar().week.rename("week")])["close_price"].mean()# 연도를 기준으로 몇번째 주차인지 표시    
    BTC_week_group = BTC_group_by_week.reset_index(name="week_price_mean")
    BTC_week_group["week_change"] = BTC_week_group["week_price_mean"].pct_change() * 100
    print(f"============BTC_test==================")
    # print(f"{BTC_week_group}")
    
    
    # 월 단위 변동률
    BTC_group_by_year_month = BTC.groupby([BTC["open_time"].dt.year.rename("year"), BTC["open_time"].dt.month.rename("month")])["close_price"].mean() 
    BTC_month_group = BTC_group_by_year_month.reset_index(name="price_mean")
    BTC_month_group["month_change"] = BTC_month_group["price_mean"].pct_change() * 100
    # print(BTC_month_group["month_change"])
    
    return BTC, BTC_week_group, BTC_month_group
    # print(BTC[["open_time","close_price", "daily_change" ,"week_change"]].sort_values("open_time", ascending = False))
    
    # df_week = df[df["open_time"] > week_ago].sort_values("open_time", ascending = False)
    # df_week_change_rate = df_week["close_price"].pct_change(periods = 7) * 100
    # print(df_week_change_rate)

    

    
if __name__ == "__main__":    
    df = index()
    count_change_rate(df)