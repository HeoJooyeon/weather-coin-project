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
        SELECT * FROM binance_ohlcv_1h where hour(open_time) = 0  
    """
    
    df = pd.read_sql(query, connection)   
    
    connection.close()
    
    return df

# 기술 지표 예측
 
def calcurate_indicators(df):
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]
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
    
# 점수 계산
def calculate_score(coin_df):
    
    score_lists = {}
    results = []
    score_mapping = {
        1: "so bad",
        2: "bad",
        3: "so so",
        4: "good",
        5: "so good",
    } 
    
    for df in coin_df:
        df["sma_50"] = ta.sma(df["close_price"], length=50)
        scores = []
        score_texts = []
        
        for _, row in df.iterrows():
            
            score = 3            
        
            # rsi 조건
            rsi = row.get("rsi", 0) # rsi 열이 존재할 시 rsi 출력, 없으면 0 출력
            
            if rsi < 20:
                score += 2 
            elif rsi < 30:
                score += 1
            elif rsi > 80:
                score -= 2 
            elif rsi > 70:
                score -= 1               
            
            # macd 조건
            macd_diff = row.get('macd_line',0) - row.get('macd_signal',0)
            if macd_diff > 1:
                score += 2
            elif macd_diff > 0:
                score += 1
            elif macd_diff < -1:
                score -= 2
            elif macd_diff < 0:
                score -= 1
                            
            # sma 조건
            sma_20 = row.get("sma_20", 0)
            sma_50 = row.get("sma_50", 0) or 0
            
                    
            if sma_20 > sma_50:
                score += 1
            else:
                score -= 1 
            
            score = max(1, min(score, 5))
                
            scores.append(score)
            score_texts.append(score_mapping.get(score, "unknown"))
        
        # 점수 및 텍스트 결과 컬럼 추가    
        df["score"] = scores
        df["score_text"] = score_texts        
        results.append(df.fillna(0))    
        
    return results

def input_coin_indicator(coin_scores):      
        
    # score    
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        
        for df in coin_scores:
            for _, row in df.iterrows():
                cur.execute("""
                    INSERT INTO coin_indicator_day(
                        pair,open_time,ma_5D ,ma_20D ,ema_5D ,ema_20D ,rsi_day ,macd_day ,macd_signal_day ,macd_histogram_day ,score,w_icon,created_at,updated_at,deleted_at
                    ) VALUES(
                        %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s,%s,%s, NOW(), NOW(), NOW()
                    )
                """, (
                    row["pair"], row["open_time"], row.get("sma_5", 0),row.get("sma_20", 0),row.get("ema_5", 0),row.get("ema_20", 0),row.get("rsi", 0),row.get("macd_line", 0),row.get("macd_signal", 0),row.get("macd_histogram", 0),row.get("score"),row.get("score_text")
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
    coin_scores = calculate_score(coin_indicators)
    input_coin_indicator(coin_scores)
    
    