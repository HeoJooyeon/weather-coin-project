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

// 서버 API에서 코인 목록을 가져오는 함수
export async function fetchCoinsFromServerAPI() {
  try {
    const response = await fetch("http://localhost:3001/api/coins");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `서버 API 오류: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      // API에서 가져온 코인 목록에 pair 필드 보장
      const coinsWithPair = result.data.map((coin) => {
        if (!coin.pair) {
          coin.pair = `${coin.symbol}USDT`;
        }
        return coin;
      });
      return coinsWithPair;
    } else {
      throw new Error(result.message || "코인 데이터를 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("서버 API에서 코인 목록을 가져오는 중 오류 발생:", error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

// 코인 과거 정보를 가져오는 함수
export async function fetchCoinWeatherData(pair) {
  if (!pair) {
    console.warn("fetchCoinWeatherData: pair 값이 없습니다.");
    return null;
  }

  try {
    const response = await fetch(
      `http://localhost:3001/api/coin/past?pair=${pair}&limit=1`,
    );

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data && result.data.length > 0) {
      return result.data[0];
    }

    return null;
  } catch (error) {
    console.error(`${pair} 날씨 데이터 가져오기 오류:`, error);
    return null;
  }
}

// 날씨 텍스트를 아이콘 및 설명으로 매핑
export const weatherIcons = {
  // 점수 기반 매핑 (1: 최악 ~ 5: 최상)
  1: { icon: "⛈️", label: "폭풍", description: "급락세 예상" },
  2: { icon: "🌧️", label: "비", description: "하락세 예상" },
  3: { icon: "☁️", label: "흐림", description: "관망세 예상" },
  4: { icon: "⛅️", label: "구름조금", description: "약세장 예상" },
  5: { icon: "🔆", label: "맑음", description: "강세 예상" },

  // 영어 날씨 상태 매핑 추가
  Bad: { icon: "⛈️", label: "폭풍", description: "급락세 예상" },
  Poor: { icon: "🌧️", label: "비", description: "하락세 예상" },
  Neutral: { icon: "☁️", label: "흐림", description: "관망세 예상" },
  Fair: { icon: "⛅️", label: "구름조금", description: "약세장 예상" },
  Good: { icon: "🔆", label: "맑음", description: "강세 예상" },

  // 한글 날씨 상태 매핑
  맑음: { icon: "🔆", label: "맑음", description: "강세 예상" },
  구름조금: { icon: "⛅️", label: "구름조금", description: "약세장 예상" },
  흐림: { icon: "☁️", label: "흐림", description: "관망세 예상" },
  비: { icon: "🌧️", label: "비", description: "하락세 예상" },
  폭풍: { icon: "⛈️", label: "폭풍", description: "급락세 예상" },
  눈: { icon: "❄️", label: "눈", description: "변동성 확대" },
  바람: { icon: "💨", label: "바람", description: "시장 불안정" },
};

// API 날씨 데이터를 포맷팅하는 헬퍼 함수
export function formatWeatherData(weatherData, symbol) {
  if (!weatherData) return null;

  return [
    {
      day: "yesterday",
      icon: getWeatherIcon(weatherData.weather_yesterday),
      label: getWeatherLabel(weatherData.weather_yesterday),
      description: getWeatherDescription(weatherData.weather_yesterday),
      tooltip: `${symbol} 어제 예상: ${getWeatherDescription(weatherData.weather_yesterday)}`,
    },
    {
      day: "today",
      icon: getWeatherIcon(weatherData.weather_today),
      label: getWeatherLabel(weatherData.weather_today),
      description: getWeatherDescription(weatherData.weather_today),
      tooltip: `${symbol} 오늘 예상: ${getWeatherDescription(weatherData.weather_today)}`,
    },
    {
      day: "tomorrow",
      icon: getWeatherIcon(weatherData.weather_tomorrow),
      label: getWeatherLabel(weatherData.weather_tomorrow),
      description: getWeatherDescription(weatherData.weather_tomorrow),
      tooltip: `${symbol} 내일 예상: ${getWeatherDescription(weatherData.weather_tomorrow)}`,
    },
  ];
}

// 날씨 데이터에서 아이콘 추출 (외부에서도 사용하도록 export)
export function getWeatherIcon(weatherData) {
  if (weatherData === undefined || weatherData === null) {
    return "❓";
  }

  if (weatherData in weatherIcons) {
    return weatherIcons[weatherData]?.icon || "❓";
  }

  const numericValue = parseInt(weatherData);
  if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
    return weatherIcons[numericValue]?.icon || "❓";
  }

  return "❓";
}

// 날씨 데이터에서 레이블 추출
export function getWeatherLabel(weatherData) {
  if (weatherData === undefined || weatherData === null) {
    return "알 수 없음";
  }

  if (weatherData in weatherIcons) {
    return weatherIcons[weatherData]?.label || weatherData || "알 수 없음";
  }

  const numericValue = parseInt(weatherData);
  if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
    return weatherIcons[numericValue]?.label || "알 수 없음";
  }

  return weatherData || "알 수 없음";
}

// 날씨 데이터에서 설명 추출
export function getWeatherDescription(weatherData) {
  if (weatherData === undefined || weatherData === null) {
    return "정보 없음";
  }

  if (weatherData in weatherIcons) {
    return weatherIcons[weatherData]?.description || "정보 없음";
  }

  const numericValue = parseInt(weatherData);
  if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 5) {
    return weatherIcons[numericValue]?.description || "정보 없음";
  }

  return "정보 없음";
}

// 랜덤 시가총액 데이터 생성 (임시 함수)
export function getMarketCapHistory() {
  const labels = [];
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    data.push(100 + Math.random() * 50);
  }
  return { labels, data };
}

// 공포/탐욕 지수 관련 함수
export function getFearGreedIndex() {
  return Math.floor(Math.random() * 101);
}

export function getFearGreedLabel(value) {
  if (value < 20) return "극단적 공포";
  if (value < 40) return "공포";
  if (value < 60) return "중립";
  if (value < 80) return "탐욕";
  return "극단적 탐욕";
}

export function getFearGreedEmoji(value) {
  if (value < 20) return "😱";
  if (value < 40) return "😨";
  if (value < 60) return "😐";
  if (value < 80) return "😊";
  return "🤩";
}

// CoinDetail.js에서 사용하는 함수들 (호환성 유지)
export function getWeatherPrediction(symbol) {
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

export function getTechnicalIndicators(symbol) {
  return {
    ma: Math.random() * 100,
    ema: Math.random() * 100,
    rsi: Math.random() * 100,
    macd: (Math.random() * 2 - 1) * 10,
  };
}
