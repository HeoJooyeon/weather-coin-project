from flask import Flask, render_template, request
from datetime import datetime
import requests
import pymysql
import schedule
import time
import os
from dotenv import load_dotenv


load_dotenv()

# MySQL 연결
def connect_mysql():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="981021",
        db="exchange_info_db",
        charset="utf8mb4"
    )
 

def fetch_exchange_1year_to_mysql():   
    from datetime import date    
    try:        
        connection = connect_mysql()
        cur = connection.cursor()
        # 환율 정보 api에서 파일 불러오기
        api_key = os.environ.get("api_key")   
        today = date.today()                                    
        
        # url = f"https://api.exchangerate.host/timeframe?access_key={api_key}&start_date=2025-05-01&end_date=2025-05-14&currencies=KRW"
        url = f"https://api.exchangerate.host/live?access_key={api_key}&currencies=KRW"
        response = requests.get(url)
        items = response.json()
        
        base_currency = items.get("source")
        quotes = items.get("quotes")
        
        for target, rate in quotes.items():        
            print(f"item:{target} / value:{rate}")
            
            # for _, rate in rates.items():
                                
        # TABLE에 정보 삽입 // open_time이 중복될 시 이전의 값에서 현재의 값으로 update
            cur.execute(f"""
                INSERT INTO exchange_rate(base_currency , target_currency , rate , rate_date , created_at , updated_at , deleted_at)
                VALUES(%s, "KRW", %s, NOW(), NOW(), NOW(), NOW())                
            """, (base_currency, rate))
                            
        # SQL에 저장 후 종료 
        connection.commit()                
        
        print("MySQL 저장 완료")               
        
    except pymysql.MySQLError as e:
        print(f"db 연결 오류: {e}")
    finally:
        if connection:
            connection.close()

# fetch_coin_to_mysql 함수 실행
def job():
    print("데이터 삽입 시작")
    fetch_exchange_1year_to_mysql()
    print("데이터 삽입 완료")

# 1초 간격으로 schedule 상태 확인
def run_schedule():
    while True:
        schedule.run_pending() # schedule이 실행 가능한 상태일 시 즉시 실행
        time.sleep(10) # 10초마다 run_schedule 실행 (CPU 폭주 방지 => 작성하지 않을 시 무한으로 코드 호출)

schedule.every(15).seconds.do(job) # 실행할 작업 예약 // 지정한 시간마다 실행 가능한 상태로 변경

if __name__ == "__main__":
    job()
    run_schedule()