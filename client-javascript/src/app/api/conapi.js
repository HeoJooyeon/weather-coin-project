// src/app/api/conapi.js

const API_BASE_URL = "http://localhost:3001/api";

// 코인 심볼에 따른 그래픽 심볼 매핑 함수
function getSymbolGraphic(symbol) {
  const symbolMap = {
    BTC: "₿",
    ETH: "Ξ",
    XRP: "✕",
    BNB: "BNB",
    SOL: "SOL",
    DOGE: "Ɖ",
    ADA: "₳",
    TRX: "TRX",
    SHIB: "SHIB",
    LTC: "Ł",
  };
  return symbolMap[symbol] || symbol;
}

// 서버 API에서 코인 목록을 가져오는 함수
export async function fetchCoinsFromServerAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/coins`);
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: `코인 목록 API 오류: ${response.status}` }));
      console.error(
        `코인 목록 API 오류 (${response.status}):`,
        errorData.message
      );
      throw new Error(
        errorData.message || `코인 목록 API 오류: ${response.status}`
      );
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((coin) => ({
        ...coin,
        pair: coin.pair || `${coin.symbol}USDT`,
        logo_url: coin.logourl || coin.logo_url,
        graphicSymbol: getSymbolGraphic(coin.symbol),
      }));
    } else {
      console.error(
        "코인 목록 데이터 파싱 실패 또는 API 오류:",
        result.message
      );
      return [];
    }
  } catch (error) {
    console.error("코인 목록 가져오기 중 예외 발생:", error, error.stack);
    return [];
  }
}

// 날짜를 YYYY-MM-DD 형식의 문자열로 포맷하는 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 코인 가격 및 3일치 날씨(스코어 기반) 정보를 가져오는 함수
export async function fetchCoinUIData(pairSymbol) {
  let originalPair = pairSymbol;
  if (!originalPair) {
    console.warn("fetchCoinUIData: pairSymbol 값이 없습니다.");
    return {
      current_price: 0,
      change_24h: 0,
      score_for_yesterday_weather: null,
      score_for_today_weather: null,
      score_for_tomorrow_weather: null,
    };
  }

  let apiPair = originalPair;
  if (!apiPair.endsWith("USDT") && apiPair.length <= 4) {
    apiPair = `${apiPair}USDT`;
  }

  try {
    // 1. 가격 정보 가져오기 - 이 부분은 실제 현재 가격을 가져오는 API로 대체하는 것이 좋으나,
    // 요청에 따라 7일치 그래프는 indicator/day에서 가져오므로, 여기서는 최신 가격을 위한 API 호출을 유지.
    // 만약 indicator/day의 가장 최신 데이터가 현재 가격을 나타낸다면, 이 priceResponse 호출은 불필요할 수 있음.
    const priceResponse = await fetch(
      `${API_BASE_URL}/coin/past?pair=${apiPair}&limit=1`
    );
    let priceData = { current_price: 0, change_24h: 0 };

    if (priceResponse.ok) {
      const priceResult = await priceResponse.json();
      if (
        priceResult.success &&
        priceResult.data &&
        priceResult.data.length > 0
      ) {
        const pData = priceResult.data[0];
        priceData.current_price =
          pData.current_price || pData.currentprice || 0;
        priceData.change_24h = pData.change_24h || pData.change24h || 0;
      } else {
        console.warn(`${apiPair} 가격 정보 없음. API 응답:`, priceResult);
      }
    } else {
      console.error(
        `가격 정보 API 오류 (${priceResponse.status}) for ${apiPair}`
      );
    }

    // 2. 스코어 가져올 날짜 계산: 오늘(T), 어제(T-1), 그저께(T-2)
    const today_T = new Date();
    const yesterday_T_minus_1 = new Date(today_T);
    yesterday_T_minus_1.setDate(today_T.getDate() - 1);
    const day_before_yesterday_T_minus_2 = new Date(today_T);
    day_before_yesterday_T_minus_2.setDate(today_T.getDate() - 2);

    const today_T_String = formatDate(today_T);
    const yesterday_T_minus_1_String = formatDate(yesterday_T_minus_1);
    const day_before_yesterday_T_minus_2_String = formatDate(
      day_before_yesterday_T_minus_2
    );

    // 3. 필요한 3일치 스코어 데이터 한 번에 가져오기
    const indicatorUrl = `${API_BASE_URL}/indicator/day?pair=${apiPair}&startTime=${day_before_yesterday_T_minus_2_String}&endTime=${today_T_String}&limit=3`;

    let score_for_yesterday_weather = null;
    let score_for_today_weather = null;
    let score_for_tomorrow_weather = null;

    const indicatorResponse = await fetch(indicatorUrl);
    if (indicatorResponse.ok) {
      const indicatorResult = await indicatorResponse.json();
      let dailyScores = [];

      if (indicatorResult.success && indicatorResult.data) {
        dailyScores = indicatorResult.data;
      } else if (Array.isArray(indicatorResult)) {
        dailyScores = indicatorResult;
      } else {
        console.warn(
          `${apiPair} 3일치 스코어 정보 없음 또는 API 응답 형식 불일치. 응답:`,
          indicatorResult
        );
      }

      console.log(
        `indicator/day for ${apiPair} (range ${day_before_yesterday_T_minus_2_String} to ${today_T_String}) received data for weather:`,
        dailyScores
      );

      for (const record of dailyScores) {
        const recordDate = record.open_time
          ? formatDate(new Date(record.open_time))
          : null;
        if (recordDate && record.score !== undefined) {
          if (recordDate === day_before_yesterday_T_minus_2_String) {
            score_for_yesterday_weather = record.score;
          }
          if (recordDate === yesterday_T_minus_1_String) {
            score_for_today_weather = record.score;
          }
          if (recordDate === today_T_String) {
            score_for_tomorrow_weather = record.score;
          }
        }
      }
      console.log(
        `Extracted scores for weather in ${apiPair}: T-2 (for Yesterday's weather)=${score_for_yesterday_weather}, T-1 (for Today's weather)=${score_for_today_weather}, T (for Tomorrow's weather)=${score_for_tomorrow_weather}`
      );
    } else {
      console.error(
        `3일치 스코어 API 오류 (${indicatorResponse.status}) for ${apiPair}. URL: ${indicatorUrl}`
      );
    }

    return {
      current_price: priceData.current_price, // 이 가격은 /coin/past 에서 가져온 최신 가격
      change_24h: priceData.change_24h,
      score_for_yesterday_weather,
      score_for_today_weather,
      score_for_tomorrow_weather,
    };
  } catch (error) {
    console.error(`${originalPair} UI 데이터 가져오기 중 예외 발생:`, error);
    return {
      current_price: 0,
      change_24h: 0,
      score_for_yesterday_weather: null,
      score_for_today_weather: null,
      score_for_tomorrow_weather: null,
    };
  }
}

// 특정 코인의 7일치 "가격" 이력을 coin_indicator_day 테이블에서 가져오는 함수 (수정됨)
// 가격으로 사용할 필드는 'score'로 가정 (실제 가격 필드가 있다면 그것으로 변경)
export async function fetchCoinPriceHistory(apiPair, limit = 7) {
  if (!apiPair) {
    console.warn("fetchCoinPriceHistory: apiPair 값이 없습니다.");
    return [];
  }
  try {
    const today = new Date();
    const endDate = formatDate(today);
    const startDateObj = new Date(today);
    startDateObj.setDate(today.getDate() - (limit - 1)); // limit일 전부터 오늘까지
    const startDate = formatDate(startDateObj);

    // /indicator/day API 사용
    const historyUrl = `${API_BASE_URL}/indicator/day?pair=${apiPair}&startTime=${startDate}&endTime=${endDate}&limit=${limit}`;
    const response = await fetch(historyUrl);

    if (!response.ok) {
      console.error(
        `7일치 지표(가격 대용) API 오류 (${response.status}) for ${apiPair}. URL: ${historyUrl}`
      );
      return [];
    }
    const result = await response.json();
    let historicalData = [];

    if (result.success && result.data) {
      historicalData = result.data;
    } else if (Array.isArray(result)) {
      historicalData = result;
    } else {
      console.warn(
        `${apiPair}에 대한 7일치 지표(가격 대용) 데이터가 없거나 API 응답 형식 불일치. 응답:`,
        result
      );
      return [];
    }

    console.log(
      `indicator/day for ${apiPair} (range ${startDate} to ${endDate}) received data for chart:`,
      historicalData
    );

    // API 응답에서 날짜(open_time)와 가격으로 사용할 값(score)을 추출
    // 데이터는 시간 순으로 정렬되어야 함 (오래된 -> 최신)
    return historicalData
      .map((item) => ({
        date: item.open_time, // 날짜 필드
        price: item.score, // 가격 대신 score 필드 사용 (실제 가격 필드가 있다면 변경)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error(
      `${apiPair} 7일치 지표(가격 대용) 가져오기 중 예외 발생:`,
      error
    );
    return [];
  }
}

// 날씨 아이콘 및 설명 매핑
export const weatherConditions = {
  1: {
    icon: "⛈️",
    label: "매우 나쁨",
    description: "급락세 예상, 투자 위험 매우 높음",
  },
  2: { icon: "🌧️", label: "나쁨", description: "하락세 예상, 투자 위험 높음" },
  3: { icon: "☁️", label: "보통", description: "관망세 또는 혼조세 예상" },
  4: { icon: "⛅️", label: "좋음", description: "상승세 예상, 투자 기회 모색" },
  5: {
    icon: "🔆",
    label: "매우 좋음",
    description: "강한 상승세 예상, 적극 투자 고려",
  },
  Unknown: { icon: "❓", label: "알 수 없음", description: "정보 없음" },
};

function getWeatherDetailsByScore(scoreValue) {
  if (scoreValue === undefined || scoreValue === null || scoreValue === "") {
    return weatherConditions["Unknown"];
  }
  const numericScore = parseInt(scoreValue);
  if (!isNaN(numericScore) && weatherConditions[numericScore]) {
    return weatherConditions[numericScore];
  }
  console.warn(
    `유효하지 않거나 범위를 벗어난 score 값(${scoreValue})입니다. '알 수 없음'으로 처리합니다.`
  );
  return weatherConditions["Unknown"];
}

export function getWeatherIcon(scoreValue) {
  return getWeatherDetailsByScore(scoreValue).icon;
}

export function getWeatherLabel(scoreValue) {
  return getWeatherDetailsByScore(scoreValue).label;
}

export function getWeatherDescription(scoreValue) {
  return getWeatherDetailsByScore(scoreValue).description;
}

export function formatScoreBasedWeatherData(uiData, symbol) {
  if (!uiData) {
    const unknownWeather = weatherConditions["Unknown"];
    return [
      {
        day: "yesterday",
        ...unknownWeather,
        tooltip: `${symbol} 어제: 정보 없음`,
      },
      { day: "today", ...unknownWeather, tooltip: `${symbol} 오늘: 정보 없음` },
      {
        day: "tomorrow",
        ...unknownWeather,
        tooltip: `${symbol} 내일: 정보 없음`,
      },
    ];
  }

  const yesterdayWeather = getWeatherDetailsByScore(
    uiData.score_for_yesterday_weather
  );
  const todayWeather = getWeatherDetailsByScore(uiData.score_for_today_weather);
  const tomorrowWeather = getWeatherDetailsByScore(
    uiData.score_for_tomorrow_weather
  );

  return [
    {
      day: "yesterday",
      icon: yesterdayWeather.icon,
      label: yesterdayWeather.label,
      description: yesterdayWeather.description,
      tooltip: `${symbol} 어제 (T-2일 스코어: ${
        uiData.score_for_yesterday_weather === null ||
        uiData.score_for_yesterday_weather === undefined
          ? "없음"
          : uiData.score_for_yesterday_weather
      }): ${yesterdayWeather.description}`,
    },
    {
      day: "today",
      icon: todayWeather.icon,
      label: todayWeather.label,
      description: todayWeather.description,
      tooltip: `${symbol} 오늘 (T-1일 스코어: ${
        uiData.score_for_today_weather === null ||
        uiData.score_for_today_weather === undefined
          ? "없음"
          : uiData.score_for_today_weather
      }): ${todayWeather.description}`,
    },
    {
      day: "tomorrow",
      icon: tomorrowWeather.icon,
      label: tomorrowWeather.label,
      description: tomorrowWeather.description,
      tooltip: `${symbol} 내일 (T일 스코어: ${
        uiData.score_for_tomorrow_weather === null ||
        uiData.score_for_tomorrow_weather === undefined
          ? "없음"
          : uiData.score_for_tomorrow_weather
      }): ${tomorrowWeather.description}`,
    },
  ];
}

// --- 뉴스, 게시판, 기타 유틸리티 함수 (변경 없음) ---
export async function fetchNews({ symbol, limit = 5 } = {}) {
  const queryParams = new URLSearchParams();
  if (symbol) queryParams.append("symbol", symbol);
  queryParams.append("limit", limit.toString());
  try {
    const response = await fetch(
      `${API_BASE_URL}/news?${queryParams.toString()}`
    );
    if (!response.ok) {
      console.error(`뉴스 API 오류 (${response.status}) for ${symbol}`);
      return null;
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    } else {
      console.error("뉴스 데이터 파싱 실패 또는 API 오류:", result.message);
      return null;
    }
  } catch (error) {
    console.error(
      `뉴스 데이터 가져오기 중 예외 (symbol: ${symbol}, pair: ${pair}):`,
      error
    );
    return null;
  }
}

export async function fetchBoardPosts({
  limit = 10,
  offset = 0,
  coinSymbol = "",
  sort = "",
  prediction = "",
} = {}) {
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  if (coinSymbol) queryParams.append("coin_symbol", coinSymbol);
  if (sort) queryParams.append("sort", sort);
  if (prediction) queryParams.append("prediction", prediction);
  try {
    const response = await fetch(
      `${API_BASE_URL}/board/post?${queryParams.toString()}`
    );
    if (!response.ok) {
      console.error(`게시글 API 오류 (${response.status})`);
      return [];
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((post) => ({
        postid: post.postid || post.post_id,
        title: post.title,
        content: post.content,
        writerid: post.writerid || post.writer_id,
        viewcount: post.viewcount || post.view_count,
        likes: post.likes,
        createdat: post.createdat || post.created_at,
        updatedat: post.updatedat || post.updated_at,
        coinSymbol: post.coinSymbol || post.coin_symbol || coinSymbol || null,
      }));
    } else {
      console.error("게시글 데이터 파싱 실패 또는 API 오류:", result.message);
      return [];
    }
  } catch (error) {
    console.error("게시글 데이터 가져오기 중 예외 발생:", error);
    return [];
  }
}

export async function fetchBoardPostDetail(postId) {
  if (!postId) {
    console.warn("fetchBoardPostDetail: postId가 없습니다.");
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/board/post/${postId}`);
    if (!response.ok) {
      console.error(`게시글 상세 API 오류 (${response.status})`);
      return null;
    }
    const result = await response.json();
    if (result.success && result.data) {
      return {
        postid: result.data.postid || result.data.post_id,
        title: result.data.title,
        content: result.data.content,
        writerid: result.data.writerid || result.data.writer_id,
        viewcount: result.data.viewcount || result.data.view_count,
        likes: result.data.likes,
        createdat: result.data.createdat || result.data.created_at,
        updatedat: result.data.updatedat || result.data.updated_at,
      };
    } else {
      console.error(
        "게시글 상세 데이터 파싱 실패 또는 API 오류:",
        result.message
      );
      return null;
    }
  } catch (error) {
    console.error(
      `게시글 상세 정보 가져오기 중 예외 발생 (postId: ${postId}):`,
      error
    );
    return null;
  }
}

export async function fetchComments(postId, { limit = 50, offset = 0 } = {}) {
  if (!postId) {
    console.warn("fetchComments: postId가 없습니다.");
    return [];
  }
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });
  try {
    const response = await fetch(
      `${API_BASE_URL}/board/comment/post/${postId}?${queryParams.toString()}`
    );
    if (!response.ok) {
      console.error(`댓글 API 오류 (${response.status})`);
      return [];
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((comment) => ({
        commentid: comment.commentid || comment.comment_id,
        postid: comment.postid || comment.post_id,
        writerid: comment.writerid || comment.writer_id,
        content: comment.content,
        likes: comment.likes,
        createdat: comment.createdat || comment.created_at,
      }));
    } else {
      console.error("댓글 데이터 파싱 실패 또는 API 오류:", result.message);
      return [];
    }
  } catch (error) {
    console.error(
      `댓글 목록 가져오기 중 예외 발생 (postId: ${postId}):`,
      error
    );
    return [];
  }
}

export async function createBoardPost({
  title,
  content,
  writerId,
  coinSymbol,
  prediction,
}) {
  if (!title || !content || !writerId) {
    console.warn(
      "createBoardPost: 필수 필드(title, content, writerId)가 누락되었습니다."
    );
    return null;
  }
  try {
    const payload = { title, content, writerid: writerId };
    if (coinSymbol) payload.coin_symbol = coinSymbol;
    if (prediction) payload.prediction = prediction;

    const response = await fetch(`${API_BASE_URL}/board/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      console.error(
        `게시글 작성 API 오류 (${response.status}):`,
        errorBody.message
      );
      return null;
    }
    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    } else {
      console.error("게시글 작성 실패:", result.message);
      return null;
    }
  } catch (error) {
    console.error("게시글 작성 중 예외 발생:", error);
    return null;
  }
}

export function formatApiTimestamp(timestamp, includeTime = true) {
  if (!timestamp) return "시간 정보 없음";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.warn(
        "formatApiTimestamp: 유효하지 않은 타임스탬프 값:",
        timestamp
      );
      return "시간 정보 없음";
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("날짜 포맷팅 오류:", e, "입력값:", timestamp);
    return String(timestamp);
  }
}

export async function fetchFearGreedIndexData() {
  try {
    const response = await fetch(
      "https://api.alternative.me/fng/?limit=1&format=json"
    );
    if (!response.ok) {
      console.error("Fear & Greed API 호출 실패:", response.status);
      return { value: "50", value_classification: "Neutral" };
    }
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      return data.data[0];
    }
    console.warn(
      "Fear & Greed API 응답 형식이 올바르지 않거나 데이터가 없습니다.",
      data
    );
    return { value: "50", value_classification: "Neutral" };
  } catch (error) {
    console.error("Fear & Greed API 통신 오류:", error);
    return { value: "50", value_classification: "Neutral" };
  }
}

export function getFearGreedLabelFromAPI(valueClassification) {
  const labelMap = {
    "Extreme Fear": "극단적 공포",
    Fear: "공포",
    Neutral: "중립",
    Greed: "탐욕",
    "Extreme Greed": "극단적 탐욕",
  };
  return labelMap[valueClassification] || valueClassification || "중립";
}

export function getFearGreedEmojiFromAPI(valueClassification) {
  if (valueClassification === "Extreme Fear") return "😱";
  if (valueClassification === "Fear") return "😨";
  if (valueClassification === "Neutral") return "😐";
  if (valueClassification === "Greed") return "😊";
  if (valueClassification === "Extreme Greed") return "🤩";
  return "🤔";
}

export async function fetchBtcChartDataFromDB(pair) {
  const startTime = "20250401";
  const endTime = "20250501";
  const response = await fetch(
    `http://localhost:3001/api/ohlcv?pair=${pair}&startTime=${startTime}&endTime=${endTime}`
  );
  const json = await response.json();
  return json.success ? json.data : [];
}

export async function fetchIndicatorData(pair) {
  const startTime = "20250401";
  const endTime = "20250501";
  const res = await fetch(
    `http://localhost:3001/api/indicator/day?pair=${pair}&startTime=${startTime}&endTime=${endTime}`
  );
  const json = await res.json();
  return json;
}

export async function fetchGoldPriceData() {
  const encodedItem = encodeURIComponent("금 99.99_1Kg"); // 한글 인코딩
  const startDate = "20250401";
  const endDate = "20250501";
  const res = await fetch(
    `http://localhost:3001/api/gold?itemName=${encodedItem}&startDate=${startDate}&endDate=${endDate}`
  );
  const json = await res.json();

  // 응답이 배열일 경우 그대로 반환
  if (Array.isArray(json)) return json;

  // 응답이 { data: [...] } 형식일 경우
  if (json.data) return json.data;

  console.warn("[fetchGoldPriceData] Unexpected response:", json);
  return [];
}

export async function fetchExchangeRateData() {
  const targetCurrency = "KRW"; // 한글 인코딩
  const startDate = "20250401";
  const endDate = "20250501";
  const res = await fetch(
    `http://localhost:3001/api/exchange?targetCurrency=${targetCurrency}&startDate=${startDate}&endDate=${endDate}`
  );
  const json = await res.json();
  return Array.isArray(json) ? json : json.data || [];
}
