// app/api/conapi.js


export const COIN_LIST = [
  {
    rank: 1,
    name: "비트코인",
    symbol: "BTC",
    graphicSymbol: "₿", // 비트코인 그래픽 심볼
    apiSymbol: "BTCUSDT",
    price: "$67,890.45",
    change: "+2.34%",
  },
  {
    rank: 2,
    name: "이더리움",
    symbol: "ETH",
    graphicSymbol: "Ξ", // 이더리움 그래픽 심볼
    apiSymbol: "ETHUSDT",
    price: "$3,456.78",
    change: "+1.23%",
  },
  {
    rank: 3,
    name: "리플",
    symbol: "XRP",
    graphicSymbol: "✕", // 리플 그래픽 심볼 (일반적으로 사용되는 X)
    apiSymbol: "XRPUSDT",
    price: "$1.23",
    change: "-0.45%",
  },
  {
    rank: 4,
    name: "바이낸스코인",
    symbol: "BNB",
    graphicSymbol: "BNB", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
    apiSymbol: "BNBUSDT",
    price: "$456.78",
    change: "+0.89%",
  },
  {
    rank: 5,
    name: "솔라나",
    symbol: "SOL",
    graphicSymbol: "SOL", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
    apiSymbol: "SOLUSDT",
    price: "$123.45",
    change: "+5.67%",
  },
  {
    rank: 6,
    name: "도지코인",
    symbol: "DOGE",
    graphicSymbol: "Ɖ", // 도지코인 그래픽 심볼
    apiSymbol: "DOGEUSDT",
    price: "$0.123",
    change: "-1.23%",
  },
  {
    rank: 7,
    name: "카르다노",
    symbol: "ADA",
    graphicSymbol: "₳", // 카르다노 그래픽 심볼
    apiSymbol: "ADAUSDT",
    price: "$0.456",
    change: "+0.78%",
  },
  {
    rank: 8,
    name: "트론",
    symbol: "TRX",
    graphicSymbol: "TRX", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
    apiSymbol: "TRXUSDT",
    price: "$0.089",
    change: "-0.34%",
  },
  {
    rank: 9,
    name: "시바이누",
    symbol: "SHIB",
    graphicSymbol: "SHIB", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
    apiSymbol: "SHIBUSDT",
    price: "$0.00002345",
    change: "+3.45%",
  },
  {
    rank: 10,
    name: "라이트코인",
    symbol: "LTC",
    graphicSymbol: "Ł", // 라이트코인 그래픽 심볼
    apiSymbol: "LTCUSDT",
    price: "$78.90",
    change: "-0.67%",
  },
];

// 랜덤으로 기술지표 점수 반환 (실제로는 계산 또는 API 호출 필요)
export function getTechnicalIndicators(symbol) {
  // console.log(`Fetching technical indicators for ${symbol}...`); // 실제 API 호출 시 유용
  return {
    ma: Math.random() * 100,
    ema: Math.random() * 100,
    rsi: Math.random() * 100,
    macd: (Math.random() * 2 - 1) * 10,
  };
}

// 가상의 날씨예측: 점수에 따라 아이콘 결정 (3일치 예보 반환)
export function getWeatherPrediction(symbol) {
  // console.log(`Fetching weather prediction for ${symbol}...`); // 실제 API 호출 시 유용
  const weathers = [
    { icon: "🔆", label: "맑음", description: "강세 예상" },
    { icon: "⛅️", label: "구름조금", description: "약세장 예상" },
    { icon: "☁️", label: "흐림", description: "관망세 예상" },
    { icon: "🌧️", label: "비", description: "하락세 예상" },
    { icon: "⛈️", label: "폭풍", description: "급락세 예상" },
    { icon: "❄️", label: "눈", description: "변동성 확대" },
    { icon: "💨", label: "바람", description: "시장 불안정" },
  ];

  const dailyForecasts = ["yesterday", "today", "tomorrow"].map((dayType) => {
    const idx = Math.floor(Math.random() * weathers.length);
    const weather = weathers[idx];
    return {
      day: dayType,
      icon: weather.icon,
      label: weather.label,
      description: weather.description,
      tooltip: `${symbol} ${dayType === "today" ? "오늘" : dayType === "yesterday" ? "어제" : "내일"} 예상: ${weather.description}`,
    };
  });

  return dailyForecasts;
}

// 가상의 시가총액 차트용 데이터 (7일치 랜덤 데이터 생성)
export function getMarketCapHistory(symbol) {
  // console.log(`Fetching market cap history for ${symbol}...`); // 실제 API 호출 시 유용
  const labels = [];
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    // 심볼별로 약간 다른 패턴을 주도록 랜덤 값 범위 조정 (예시)
    let baseValue = 100;
    if (symbol === "BTC") baseValue = 500;
    else if (symbol === "ETH") baseValue = 300;
    data.push(baseValue + Math.random() * (baseValue / 2));
  }
  return { labels, data };
}

// 가상의 공포/탐욕 지수 (0 ~ 100 사이의 랜덤 정수)
export function getFearGreedIndex() {
  return Math.floor(Math.random() * 101);
}

// 공포/탐욕 지수 값에 따른 레이블 반환
export function getFearGreedLabel(value) {
  if (value < 20) return "극단적 공포";
  if (value < 40) return "공포";
  if (value < 60) return "중립";
  if (value < 80) return "탐욕";
  return "극단적 탐욕";
}

// 공포/탐욕 지수 값에 따른 이모티콘 반환
export function getFearGreedEmoji(value) {
  if (value < 20) return "😱";
  if (value < 40) return "😨";
  if (value < 60) return "😐";
  if (value < 80) return "😊";
  return "🤩"; // output5.txt 에서는 "🤩" 로 되어있음. (이전 답변은 "🤑" 이었음)
}

// 추가: 실제 CoinAPI 연동을 위한 예시 함수 (주석 처리됨, API 키 필요)
/*
const COINAPI_KEY = "YOUR_API_KEY"; // 실제 API 키로 교체해야 합니다.
const BASE_URL = "https://rest.coinapi.io/v1";

export async function fetchCoinPrice(symbol = "BTC", convertTo = "USD") {
  if (!COINAPI_KEY || COINAPI_KEY === "YOUR_API_KEY") {
    console.warn("CoinAPI key is not set. Returning mock data.");
    return Math.random() * 70000; // 목업 데이터 반환
  }
  try {
    const response = await fetch(`${BASE_URL}/exchangerate/${symbol}/${convertTo}`, {
      headers: {
        'X-CoinAPI-Key': COINAPI_KEY,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`CoinAPI Error: ${response.status} - ${errorData.message || 'Failed to fetch price'}`);
    }
    const data = await response.json();
    return data.rate;
  } catch (error) {
    console.error('Error fetching data from CoinAPI:', error);
    throw error; // 에러를 다시 던져서 호출한 쪽에서 처리하도록 함
  }
}

export async function fetchHistoricalData(symbol = "BTCUSDT", periodId = "1DAY", timeStart, timeEnd) {
  if (!COINAPI_KEY || COINAPI_KEY === "YOUR_API_KEY") {
    console.warn("CoinAPI key is not set. Returning mock historical data.");
    return getMarketCapHistory(symbol.replace('USDT', '')).data.map((val, index) => ({
        time_period_start: new Date(new Date().setDate(new Date().getDate() - (6 - index))).toISOString(),
        price_close: val
    })); // 목업 데이터 반환
  }
  const startDate = timeStart || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0] + "T00:00:00";
  const endDate = timeEnd || new Date().toISOString().split('T')[0] + "T23:59:59";
  
  try {
    const response = await fetch(
      `${BASE_URL}/ohlcv/${symbol.startsWith('X:') ? symbol : 'BITSTAMP_SPOT_' + symbol.replace('USDT', '_USD')}/history?period_id=${periodId}&time_start=${startDate}&time_end=${endDate}`,
      {
        headers: {
          'X-CoinAPI-Key': COINAPI_KEY,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`CoinAPI Error: ${response.status} - ${errorData.message || 'Failed to fetch historical data'}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data from CoinAPI:', error);
    throw error;
  }
}
*/
