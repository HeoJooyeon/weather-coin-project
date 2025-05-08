from flask import Flask, render_template, request
from datetime import datetime
import requests
import pymysql
import schedule
import time
from datetime import datetime, date

# MySQL 연결
def connect_mysql():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="981021",
        db="coin_info_db",
        charset="utf8mb4"
    )

def create_table():
    try:
        connection = connect_mysql()
        cur = connection.cursor()
        cur.execute(f"""
               CREATE TABLE IF NOT EXISTS binance_ohlcv_1h (
                    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '바이낸스 코인 데이터 PK',
                    pair VARCHAR(20) NOT NULL COMMENT '코인 거래쌍 이름 (예: BTCUSDT)',
                    open_time DATETIME NOT NULL COMMENT '시가 기준 시작 시간',
                    open_price DECIMAL(20,8) NOT NULL COMMENT '시가 (가격, Open)',
                    high_price DECIMAL(20,8) NOT NULL COMMENT '고가 (가격, High)',
                    low_price DECIMAL(20,8) NOT NULL COMMENT '저가 (가격, Low)',
                    close_price DECIMAL(20,8) NOT NULL COMMENT '종가 (가격, Close)',
                    base_vol DECIMAL(20,8) NOT NULL COMMENT '코인 기준 거래량',
                    close_time DATETIME NOT NULL COMMENT '종가 기준 종료 시간',
                    quote_vol DECIMAL(20,8) COMMENT 'USDT 기준 거래량',
                    trade_count INT COMMENT '거래 횟수',
                    tb_base_vol DECIMAL(20,8) COMMENT '매수자 코인 거래량',
                    tb_quote_vol DECIMAL(20,8) COMMENT '매수자 USDT 거래량',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 삽입 일시'
                ) COMMENT = '바이낸스 1시간봉 OHLCV 데이터 테이블';
            """)
        connection.commit()
        print("테이블 생성 완료")
        
    except pymysql.MySQLError as e:
        print(f"테이블 생성 오류: {e}")
    
    finally:
        if connection:
            connection.close()            
    

def fetch_coin_to_mysql(query = "BTC"):
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
                    """, (coin, open_time, open_price, high_price, low_price, close_price, base_vol, close_time, quote_vol, trade_count, tb_base_vol[:20], tb_quote_vol))
                    
                
                # SQL에 저장 후 종료 
                
                connection.commit()                
                print("MySQL 저장 완료")
                
            except pymysql.MySQLError as e:
                print(f"데이터 삽입 오류: {e}")
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
    fetch_coin_to_mysql(query="BTC")
    print("데이터 삽입 완료")

# 1초 간격으로 schedule 상태 확인
def run_schedule():
    while True:
        schedule.run_pending() # schedule이 실행 가능한 상태일 시 즉시 실행
        time.sleep(10) # 10초마다 run_schedule 실행 (CPU 폭주 방지 => 작성하지 않을 시 무한으로 코드 호출)

schedule.every(30).seconds.do(job) # 실행할 작업 예약 // 지정한 시간마다 실행 가능한 상태로 변경

if __name__ == "__main__":
    create_table()
    job()
    run_schedule()