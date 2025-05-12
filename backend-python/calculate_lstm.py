import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import torch
from torch.utils.data import DataLoader, TensorDataset
import torch.nn as nn
import matplotlib.pyplot as plt


# 데이터 불러오기
coin_df = pd.read_csv("./csv/binance_ohlcv_1h.csv")

coin_df.set_index("open_time", inplace=True)

data = coin_df[["close_price"]].values

coin_symbols = coin_df["pair"].unique()

for symbol in coin_symbols:
    coin_data = coin_df[coin_df["pair"] == symbol].copy()

    # 0 ~ 1로 정규화   

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(coin_data[["close_price"]])

    # 시계열 시퀀스 생성
    def create_sequences(data, seq_length, target_gap):
        X, y = [], []
        
        for i in range(len(data) - seq_length - target_gap): 
            X.append(data[i:i+seq_length])
            y.append(data[i+seq_length + target_gap - 1]) # 미래 가격
            
        return np.array(X), np.array(y)

    seq_length = 60 # 60일간 데이터를 보고 다음 날 예측
    target_gap = 100

    X, y = create_sequences(scaled_data, seq_length, target_gap)

    # Tensor로 변환     

    X = torch.tensor(X, dtype = torch.float32).view(-1, seq_length, 1)
    y = torch.tensor(y, dtype = torch.float32)

    # 데이터셋 / 데이터로더 구성    

    dataset = TensorDataset(X,y)
    dataloader = DataLoader(dataset, batch_size=32, shuffle = True)

    # LSTM 모델 정의    

    class LSTMModel(nn.Module):
        def __init__(self, input_size = 1, hidden_size = 64, num_layers = 2):
            super(LSTMModel, self).__init__()
            self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
            self.fc = nn.Linear(hidden_size, 1)
        
        def forward(self, x):
            out, _ = self.lstm(x)
            return self.fc(out[:, -1, :])

    # 모델 학습

    model = LSTMModel()
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr = 0.001)

    for epoch in range(1):
        for xb, yb in dataloader:
            pred = model(xb)
            loss = criterion(pred, yb)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
        print(f"Epoch {epoch+1}, Loss: {loss.item():.8f}")
            

    # 예측 및 역 변환

    with torch.no_grad():
        last_seq = torch.tensor(scaled_data[-seq_length:], dtype= torch.float32).view(1, seq_length, 1)
        pred = model(last_seq)
        pred_price = scaler.inverse_transform(pred.numpy())
        print("last_seq:", last_seq.shape)
    print(f"예측된 내일의 {symbol} 가격: {pred_price[0][0]:,.2f} 원")


    # 예측 결과 시각화    

    model.eval()
    preds = model(X[:100]).detach().cpu().numpy()
    true = y.numpy()

    # 역 정규화
    preds = scaler.inverse_transform(preds)
    true = scaler.inverse_transform(true)

    plt.plot(true, label = "Actual")
    plt.plot(preds, label = "Predicted")
    plt.legend()
    plt.show()

        




