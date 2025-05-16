import pymysql
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

def fetch_coin_to_mysql(query = "BTC"):
    coins = ["BTC", "ETH", "XRP", "BNB", "SOL", "DOGE", "ADA","TRX", "SHIB", "LTC"]    
    
    try:
        connection = connect_mysql()
        cur = connection.cursor()
        
        for coin in coins:
            imgUrl = f"https://assets.parqet.com/logos/crypto/{coin}?format=png"
            try:                                    
                # TABLE에 정보 삽입 // open_time이 중복될 시 이전의 값에서 현재의 값으로 update
                cur.execute(f"""
                    INSERT INTO coin_master(name , symbol , pair , logo_url ,created_at, updated_at, deleted_at)
                    VALUES(%s, %s, %s, %s, NOW(), NOW(), NOW())                        
                """, (coin, coin, f"{coin}USDT", imgUrl))
                    
                
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

# # 1초 간격으로 schedule 상태 확인
# def run_schedule():
#     while True:
#         schedule.run_pending() # schedule이 실행 가능한 상태일 시 즉시 실행
#         time.sleep(10) # 10초마다 run_schedule 실행 (CPU 폭주 방지 => 작성하지 않을 시 무한으로 코드 호출)

# schedule.every(30).seconds.do(job) # 실행할 작업 예약 // 지정한 시간마다 실행 가능한 상태로 변경

if __name__ == "__main__":    
    job()
    