import pymysql
import pandas as pd
import pandas_ta as ta
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        db=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT")),
        charset="utf8mb4"
    )

# 데이터 불러오기
def load_coin_data():
    connection = get_db_connection()   
    query = f"""
        SELECT * FROM binance_ohlcv_1h
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()
    
    return df

# 기술 지표 예측
 
def calcurate_indicators(df):
    coins = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "BNBUSDT", "SOLUSDT", "DOGEUSDT", "ADAUSDT", "TRXUSDT", "SHIBUSDT", "LTCUSDT"]
    coin_results = []
    for coin in coins:        
        coin_df = df[df["pair"] == coin].sort_values("open_time")
        
        # 지표 계산
        coin_df.ta.sma(length=5, append=True)
        coin_df.ta.sma(length=20, append=True)
        coin_df.ta.ema(length=5, append=True)
        coin_df.ta.ema(length=20, append=True)
        coin_df.ta.rsi(length=14, append=True)
        coin_df.ta.macd(close="close_price", fast=12, slow=26, signal=9, append=True)
        
        # 컬럼 이름 변경
        coin_df = coin_df.rename(columns={
            "SMA_5": "sma_5",
            "SMA_20": "sma_20",
            "EMA_5": "ema_5",
            "EMA_20": "ema_20",
            "RSI_14": "rsi",
            "MACD_12_26_9": "macd_line",
            "MACDs_12_26_9": "macd_signal",
            "MACDh_12_26_9": "macd_histogram"
        })
        
        coin_results.append(coin_df.fillna(0))
    return coin_results  

def input_coin_indicator(coin_indicators):
        
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        
        for df in coin_indicators:
            for _, row in df.iterrows():
                cur.execute("""
                    INSERT INTO coin_indicator_hour(
                        pair,ma_5H ,ma_20H ,ema_5H ,ema_20H ,rsi_hour ,macd_hour ,macd_signal_hour ,macd_histogram_hour ,created_at,updated_at,deleted_at
                    ) VALUES(
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, NOW(), NOW(), NOW()
                    )
                """, (
                    row["pair"], row.get("sma_5", 0),row.get("sma_20", 0),row.get("ema_5", 0),row.get("ema_20", 0),row.get("rsi", 0),row.get("macd_line", 0),row.get("macd_signal", 0),row.get("macd_histogram", 0)
                ))
                
            connection.commit()
            print("데이터 저장 완료")                 
        
    except pymysql.MySQLError as e:
        print(f"데이터 삽입 오류: {e}")
    except Exception as e:
        print(f"기타 오류: {e}")
    
    finally:
        if connection:
            connection.close()


if __name__ == "__main__":    
    df = load_coin_data()
    coin_indicators = calcurate_indicators(df)      
    input_coin_indicator(coin_indicators)
    
    