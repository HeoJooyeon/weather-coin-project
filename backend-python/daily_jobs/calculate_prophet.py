import pandas as pd
from prophet import Prophet
from datetime import timedelta
import pymysql

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="1111",
        db="weathercoin",
        charset="utf8mb4"
    )
coin_metadata = [
    {"rank": 1, "name": "비트코인", "symbol": "BTC", "pair": "BTCUSDT"},
    {"rank": 2, "name": "이더리움", "symbol": "ETH", "pair": "ETHUSDT"},
    {"rank": 3, "name": "리플", "symbol": "XRP", "pair": "XRPUSDT"},
    {"rank": 4, "name": "바이낸스코인", "symbol": "BNB", "pair": "BNBUSDT"},
    {"rank": 5, "name": "솔라나", "symbol": "SOL", "pair": "SOLUSDT"},
    {"rank": 6, "name": "도지코인", "symbol": "DOGE", "pair": "DOGEUSDT"},
    {"rank": 7, "name": "카르다노", "symbol": "ADA", "pair": "ADAUSDT"},
    {"rank": 8, "name": "트론", "symbol": "TRX", "pair": "TRXUSDT"},
    {"rank": 9, "name": "시바이누", "symbol": "SHIB", "pair": "SHIBUSDT"},
    {"rank": 10, "name": "라이트코인", "symbol": "LTC", "pair": "LTCUSDT"}
]

# CSV 데이터 로딩 및 정렬 (최근 90일만 불러올거임)
# df = pd.read_csv('../csv/binance_ohlcv_1h.csv', parse_dates=['open_time'])
# df.sort_values('open_time', inplace=True)


connection = get_db_connection()
query = f"""
    SELECT * FROM binance_ohlcv_1h where hour(open_time) = 0
"""

df = pd.read_sql(query, connection)

connection.close()    

print(df)

# Prophet 전처리 함수
def get_coin_df_for_prophet(df, coin_dict):
    pair = coin_dict['pair']
    coin_df = df[df['pair'] == pair].copy()

    # 필요한 컬럼만 선택하고 rename
    coin_df = coin_df[['open_time', 'close_price']].dropna()
    coin_df.rename(columns={'open_time': 'ds', 'close_price': 'y'}, inplace=True)

    # 중복 제거 및 정렬
    coin_df = coin_df[~coin_df['ds'].duplicated(keep='first')]
    coin_df = coin_df.sort_values('ds')

    # 최근 90일로 제한
    latest_time = coin_df['ds'].max()
    coin_df = coin_df[coin_df['ds'] > latest_time - pd.Timedelta(days=180)]

    # float형 강제 변환
    coin_df['y'] = coin_df['y'].astype(float)

    return coin_df

# 수익률 계산 함수 (변동가 - 기준가 / 기준가 * 100) 이거 맞죠..? 소수점 2자리로 하겠음
def calculate_predicted_returns(forecast_df, current_price, base_time):
    # 기준 시점으로부터 7일, 15일, 30일 후 시간 정의
    time_7d = base_time + timedelta(days=7)
    time_15d = base_time + timedelta(days=15)
    time_30d = base_time + timedelta(days=30)

    # 해당 시점에서 가장 가까운 예측값 yhat을 가져오는 내부 함수 정의
    def get_yhat_at(target_time):
        # target_time 이후의 데이터 중 첫 번째 값 추출
        target_row = forecast_df[forecast_df['ds'] >= target_time].head(1)
        # 존재하면 yhat 반환, 없으면 None
        if not target_row.empty:
            return target_row['yhat'].values[0]
        return None

    # 각 시점의 예측 가격 추출
    yhat_7d = get_yhat_at(time_7d)
    yhat_15d = get_yhat_at(time_15d)
    yhat_30d = get_yhat_at(time_30d)

    # 수익률 계산 함수 (예측값 - 현재값) / 현재값 * 100
    def calculate_return(predicted_price):
        if predicted_price is not None:
            return round(((predicted_price - current_price) / current_price) * 100, 2)
        return None

    # 결과 수익률 
    return {
        'predict_return_7d': calculate_return(yhat_7d),
        'predict_return_15d': calculate_return(yhat_15d),
        'predict_return_30d': calculate_return(yhat_30d)
    }

# DB 저장 함수 
# 예측 결과를 DB에 저장하는 함수 (current_price 포함)
def insert_prediction_to_db(pair, current_price, returns_dict, predict_time):
    conn = get_db_connection()
    cursor = conn.cursor()

    sql = """
        INSERT INTO coin_prediction (
            pair, current_price, predict_return_7d, predict_return_15d, predict_return_30d, predict_time
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        pair,
        current_price,
        returns_dict.get('predict_return_7d'),
        returns_dict.get('predict_return_15d'),
        returns_dict.get('predict_return_30d'),
        predict_time
    )

    cursor.execute(sql, values)
    conn.commit()
    cursor.close()
    conn.close()

# 모든 코인 실행 루프
for coin in coin_metadata:
    try:
        df_prophet = get_coin_df_for_prophet(df, coin)

        model = Prophet(daily_seasonality=True, weekly_seasonality=True)
        model.fit(df_prophet)

        future = model.make_future_dataframe(periods=24*30, freq='H')
        forecast = model.predict(future)

        base_time = df_prophet['ds'].max()
        current_price = df_prophet[df_prophet['ds'] == base_time]['y'].values[0]

        returns = calculate_predicted_returns(forecast, current_price, base_time)

        insert_prediction_to_db(coin['pair'], current_price, returns, base_time)

        # 화긴용
        print(
            f"[Success] {coin['pair']} 저장 완료 | "
            f"7일: {returns['predict_return_7d']}% | "
            f"15일: {returns['predict_return_15d']}% | "
            f"30일: {returns['predict_return_30d']}%"
        )

    except Exception as e:
        print(f"[Error] {coin['pair']}: {e}")