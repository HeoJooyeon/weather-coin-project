from datetime import datetime
import requests
import pymysql
from datetime import datetime, date
import os
from dotenv import load_dotenv

load_dotenv()

def connect_mysql():
    return pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        db=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT")),
        charset="utf8mb4"
    )

def fetch_coin_to_mysql():
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]    
    
    try:
        connection = connect_mysql()
        cur = connection.cursor()
        
        for coin in coins:
            try:
                # 배열에 담긴 코인들 정보 api로 불러오기
                url = f"https://api.binance.com/api/v3/klines?symbol={coin}USDT&interval=1h"
                response = requests.get(url)
                items = response.json()
                
                # print(f"items: {items}")
                for item in items:
                    
                    # 각 item의 배열에 담긴 순서대로 아래 변수에 저장
                    open_time, open_price, high_price, low_price, close_price, base_vol, close_time, quote_vol, trade_count, tb_base_vol, tb_quote_vol, _ = item     
                    
                    # unixdatetime => datetime으로 변경
                    open_time = datetime.fromtimestamp(item[0] / 1000)
                    close_time = datetime.fromtimestamp(item[6] / 1000)                    
                    # TABLE에 정보 삽입 // open_time이 중복될 시 이전의 값에서 현재의 값으로 update
                    cur.execute(f"""
                        INSERT INTO binance_ohlcv_1h(pair, open_time, open_price, high_price, low_price, close_price, base_vol, close_time, quote_vol, trade_count, tb_base_vol, tb_quote_vol, created_at)
                        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())                        
                    """, (coin, open_time, open_price, high_price, low_price, close_price, round(float(base_vol) / 1000000, 8), close_time, quote_vol, trade_count, round(float(tb_base_vol)/ 1000000, 8), tb_quote_vol))
                    
                
                # SQL에 저장 후 종료 
                
                connection.commit()                
                print("MySQL 저장 완료")
                
                
            except pymysql.MySQLError as e:
                print(f"데이터 삽입 오류: {e}")
                print(round(float(base_vol), 10))
            except Exception as e:
                print(f"기타 오류: {e}")        
            
    except pymysql.MySQLError as e:
        print(f"db 연결 오류: {e}")
    finally:
        if connection:
            connection.close()

# fetch_coin_to_mysql 함수 실행
def job():
    print("데이터 삽입 시작")
    fetch_coin_to_mysql()
    print("데이터 삽입 완료")

# 1초 간격으로 schedule 상태 확인
# def run_schedule():
#     while True:
#         schedule.run_pending() # schedule이 실행 가능한 상태일 시 즉시 실행
#         time.sleep(10) # 10초마다 run_schedule 실행 (CPU 폭주 방지 => 작성하지 않을 시 무한으로 코드 호출)

# schedule.every(30).seconds.do(job) # 실행할 작업 예약 // 지정한 시간마다 실행 가능한 상태로 변경

if __name__ == "__main__":    
    job()    