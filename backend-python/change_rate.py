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
    
def fetch_coin_info():
    # connection = get_db_connection()           
    
    # query = f"""
    #     SELECT * FROM coin_indicator_day;        
    # """
    
    # indicator_df = pd.read_sql(query, connection)   
    
    # connection.close()
    
    three_years_df = pd.read_csv("./csv/binance_ohlcv_1h.csv")
    three_years_df["open_time"] = pd.to_datetime(three_years_df["open_time"])
    # print(df["open_time"].dtype)
    df_day = three_years_df[three_years_df["open_time"].dt.hour == 0]
    
    return df_day
    
def calculate_change_rate(df_day):    
    
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]
    date_change = []
    for coin in coins:
        
        coin_date_change = df_day[df_day["pair"] == f"{coin}USDT"]    
        # print(coin_date_change)
        
        # # 일 단위 변동률
        coin_date_change["daily_change"] = coin_date_change["close_price"].pct_change() * 100
        
        # 연간 변동률
        years = [1,2,3]
        for y in years:
            coin_date_change[f"{y}_year_change"] = None
        
        
        for idx, row in coin_date_change.iterrows():
            # 각 행을 모두 변수에 저장
            current_date = row["open_time"]
            # 현재 행을 기준으로 2년 전 데이터 변수에 저장
            for y in years:
                # print(y)
                past_date = current_date - pd.DateOffset(years = y)
                
                # 2년 전 데이터와 가장 가까운 행을 변수에 저장
                past_data = coin_date_change[coin_date_change["open_time"] <= past_date]
                
                if not past_data.empty:                
                
                    past_row = past_data.iloc[-1]
                    change = (row["close_price"] / past_row["close_price"] - 1) * 100
                else:
                    change = None
            
                # 데이터 프레임에 추가              
                coin_date_change.at[idx, f"{y}_year_change"] = change # 현재 반복 중인 행(idx)과 열에 데이터 입력\
        # for coin in coins:
        #     coin_indicator_df = indicator_df[indicator_df["pair"] == coin]
        #     coin_date_change["yestrerday_score"] = coin_indicator_df["score"].iloc[-2]              
        
        coin_date_change = coin_date_change.fillna(0)
        coin_date_change = coin_date_change.infer_objects(copy=False)
        
        date_change.append(coin_date_change)
                
    return date_change    

def input_coin_change(coin_changes):
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        
        for df in coin_changes:
            for _, row in df.iterrows():
                cur.execute("""
                    INSERT INTO coin_past_info(
                        pair,open_date  ,current_price  ,change_24h  ,change_3Y  ,change_2Y  ,change_1Y, market_cap_rank ,created_at,updated_at,deleted_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s,
                        %s,1, NOW(), NOW(), NOW()
                    )         
                """, (
                    row["pair"], row.get("open_time", 0), row.get("close_price", 0), row.get("daily_change", 0), row.get("{3_year_change", 0), row.get("2_year_change", 0), row.get("1_year_change", 0)
                ))
        connection.commit()
        print("데이터 저장 완료")
    
    except pymysql.MySQLError as e:
        print(f"데이터 삽입 오류: {e}")
    except Exception as e:
        print(f"기타 오류: {e}")
    
    finally:
        connection.close()    
    
if __name__ == "__main__":    
    df_day = fetch_coin_info()
    coin_changes = calculate_change_rate(df_day)
    input_coin_change(coin_changes)
    # calculate_weather(indicator_df)
    # print("==========test==============")
    # print(coin_changes)