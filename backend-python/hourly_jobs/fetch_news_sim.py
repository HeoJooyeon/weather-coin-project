from flask import Flask, render_template, request
from datetime import datetime
import requests
import pymysql
import time
import os
import sys
import urllib.request
import json
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
# MySQL 연결
def connect_mysql():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="981021",
        db="weathercoin",
        charset="utf8mb4"
    )       
    

def fetch_coin_to_mysql(query = "BTC"):
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]
    try:
        connection = connect_mysql()
        cur = connection.cursor()
        client_id = os.environ.get("client_id")
        client_secret = os.environ.get("client_secret")

        print(f"client_id: {client_id}")
        for coin in coins:
            try:
                # 배열에 담긴 코인들 정보 api로 불러오기
                
                encText = urllib.parse.quote(coin)
                url = f"https://openapi.naver.com/v1/search/news.json?query={encText}&sort=sim" 
                request = urllib.request.Request(url)
                request.add_header("X-Naver-Client-Id",client_id)
                request.add_header("X-Naver-Client-Secret",client_secret)
                response = urllib.request.urlopen(request)
                rescode = response.getcode()
                if(rescode==200):
                    response_body = response.read()
                    # print(response_body.decode('utf-8'))
                    data = json.loads(response_body)                               
                    if "items" in data:
                        for item in data["items"]:
                            title = item.get("title", "n/a")                            
                            url = item.get("link", "n/a")
                            content = item.get("description", "n/a")
                            publish_time_obj = item.get("pubDate", "")
                            publish_time_str = datetime.strptime(publish_time_obj, "%a, %d %b %Y %H:%M:%S %z")
                            publish_time = publish_time_str.strftime("%Y-%m-%d %H:%M:%S")
                            print(f"publish_time:{publish_time}")
                            title_without_tag = title.replace("<b>", "").replace("</b>", "")
                            url_without_tag = url.replace("<b>", "").replace("</b>", "")
                            content_without_tag = content.replace("<b>", "").replace("</b>", "")                            
                            # print(title_without_tag)
                            # TABLE에 정보 삽입 // open_time이 중복될 시 이전의 값에서 현재의 값으로 update
                            cur.execute(f"""
                                INSERT INTO coin_news(title, pair, symbol ,url, content, publish_time, created_at, updated_at ,deleted_at)
                                VALUES(%s, %s,%s,%s, %s, %s, NOW(),NOW(),NOW())                        
                            """, (title_without_tag,f"{coin}UDT",coin, url_without_tag, content_without_tag, publish_time))
                    else:
                        print("item이 없습니다")
                else: 
                    print("Error Code:" + rescode)
                # items = response.json()                
                # print(f"items: {items}")
                """ for item in items:
                    
                    # 각 item의 배열에 담긴 순서대로 아래 변수에 저장
                    title, url, content, _, _, publish_time  = item """                  
                
                # SQL에 저장 후 종료 
                connection.commit()                
                print(title_without_tag)
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

""" # 1초 간격으로 schedule 상태 확인
def run_schedule():
    while True:
        schedule.run_pending() # schedule이 실행 가능한 상태일 시 즉시 실행
        time.sleep(10) # 10초마다 run_schedule 실행 (CPU 폭주 방지 => 작성하지 않을 시 무한으로 코드 호출)

schedule.every(1).hours.do(job) # 실행할 작업 예약 // 지정한 시간마다 실행 가능한 상태로 변경 """

if __name__ == "__main__":    
    job()