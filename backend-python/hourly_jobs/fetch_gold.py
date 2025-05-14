from flask import Flask, render_template, request
from datetime import datetime
import requests
import pymysql
import schedule
import time
import xml
import xml.etree.ElementTree as ET
from datetime import date
import os
from dotenv import load_dotenv
load_dotenv()

# MySQL 연결
def connect_mysql():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="981021",
        db="gold_info_db",
        charset="utf8mb4"
    )    

def fetch_coin_to_mysql(query = "BTC"):
    
    try:       
        gold_api_key = os.environ.get("gold_api_key")
        connection = connect_mysql()
        cur = connection.cursor()        
        
        # 배열에 담긴 코인들 정보 api로 불러오기
        url = f"http://apis.data.go.kr/1160100/service/GetGeneralProductInfoService/getGoldPriceInfo?serviceKey={gold_api_key}&resultType=json&itmsNm=%EA%B8%88%2099.99_1Kg"
        
        """ xml 데이터 추출 방식
        xml_txt = response.text        
        root = ET.fromstring(xml_txt)
        body = root.find("body")
        item = root.findall("body/items/item")
        basDt = [x.text for x in root.findall("body/items/item/basDt")] """
        
        response = requests.get(url)              
        totalCount = response.json().get("response").get("body").get("totalCount")            
        items = response.json().get("response").get("body").get("items").get("item")         
        
        for item in items:
            
            basDt = item.get("basDt")
            date_str = str(basDt)
            date_time = datetime.strptime(date_str, "%Y%m%d")
            price_per_kilogram = item.get("clpr")                                
            
            # TABLE에 정보 삽입 // open_time이 중복될 시 이전의 값에서 현재의 값으로 update
            cur.execute(f"""
                INSERT INTO gold_price(currency_code, price_per_kilogram, data_time, created_at, updated_at, deleted_at)
                VALUES("KRW", %s, %s, NOW(), NOW(), NOW())                        
            """, (price_per_kilogram, date_time))
            
        
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
    fetch_coin_to_mysql(query="BTC")
    print("데이터 삽입 완료")

# 1초 간격으로 schedule 상태 확인
# def run_schedule():
#     while True:
#         schedule.run_pending() # schedule이 실행 가능한 상태일 시 즉시 실행
#         time.sleep(10) # 10초마다 run_schedule 실행 (CPU 폭주 방지 => 작성하지 않을 시 무한으로 코드 호출)

# schedule.every(15).seconds.do(job) # 실행할 작업 예약 // 지정한 시간마다 실행 가능한 상태로 변경

if __name__ == "__main__":    
    job()    