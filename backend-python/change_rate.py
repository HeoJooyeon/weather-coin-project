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
        SELECT * FROM coin_info_temporary;        
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()
    
    return df
    
def count_change_rate(df):    
    
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]
    date_change = []
    for coin in coins:
        coin_date_change = df[df["pair"] == coin]    
        # print(coin_date_change)
        
        # # 일 단위 변동률
        coin_date_change["daily_change"] = coin_date_change["current_price"].pct_change() * 100
        
        # 주 단위 변동률
        coin_group_by_week = coin_date_change.groupby([coin_date_change["open_time"].dt.year.rename("year"), coin_date_change["open_time"].dt.isocalendar().week.rename("week")])["current_price"].mean()# 연도를 기준으로 몇번째 주차인지 표시    
        coin_week_group = coin_group_by_week.reset_index(name="week_price_mean")
        coin_date_change["week_change"] = coin_week_group["week_price_mean"].pct_change() * 100
        
        # 월 단위 변동률
        coin_group_by_year_month = coin_date_change.groupby([coin_date_change["open_time"].dt.year.rename("year"), coin_date_change["open_time"].dt.month.rename("month")])["current_price"].mean() 
        coin_month_group = coin_group_by_year_month.reset_index(name="price_mean")
        coin_date_change["month_change"] = coin_month_group["price_mean"].pct_change() * 100         
        
        coin_date_change = coin_date_change.fillna(0)
        
        date_change.append(coin_date_change)
                
    return date_change
    
if __name__ == "__main__":    
    df = index()
    dc = count_change_rate(df)
    print("==========test==============")
    print(dc)