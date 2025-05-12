import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
# from config import coin_metadata

# CSV 데이터 로딩 및 정렬 (3년 → X, 전체 중 최근 180일로 제한)
df = pd.read_csv('./csv/binance_ohlcv_1h.csv', parse_dates=['open_time'])
df.sort_values('open_time', inplace=True)

# 함수: Prophet용 시계열 데이터 전처리
def get_coin_df_for_prophet(df, coin_dict):
    pair = coin_dict['pair']
    coin_df = df[df['pair'] == pair].copy()
    coin_df = coin_df[['open_time', 'close_price']].dropna()
    coin_df = coin_df.rename(columns={'open_time': 'ds', 'close_price': 'y'})  # Prophet은 반드시 ds, y 컬럼 필요
    coin_df['y'] = coin_df['y'].astype(float)
    coin_df = coin_df[~coin_df['ds'].duplicated(keep='first')]  # 중복 제거
    coin_df = coin_df.sort_values('ds')

    # 최근 180일 데이터만 사용
    latest_time = coin_df['ds'].max()
    coin_df = coin_df[coin_df['ds'] > latest_time - pd.Timedelta(days=180)]

    return coin_df

# 함수: Prophet 예측 및 시각화
def forecast_and_plot_prophet(df_prophet, coin_pair):
    model = Prophet(daily_seasonality=True, weekly_seasonality=True)
    model.fit(df_prophet)

    # 7일 (1시간 간격 → 24*7=168 스텝)
    future = model.make_future_dataframe(periods=168, freq='H')
    forecast = model.predict(future)

    # 시각화
    plt.figure(figsize=(10, 4))
    plt.plot(df_prophet['ds'][-100:], df_prophet['y'][-100:], label='Observed')
    plt.plot(forecast['ds'][-168:], forecast['yhat'][-168:], label='Forecast', color='red')
    plt.title(f'Prophet Forecast for {coin_pair}')
    plt.xlabel('Time')
    plt.ylabel('Close Price')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

coins = df

# 메인 실행 루프
for coin in coins:
    try:
        df_prophet = get_coin_df_for_prophet(df, coin)
        forecast_and_plot_prophet(df_prophet, coin['pair'])
    except Exception as e:
        print(f"[Error] {coin['pair']}: {e}")
