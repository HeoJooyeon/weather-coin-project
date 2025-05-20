// client-javascript/src/pages/CoinDetail.js
// API 호출 관련 import는 유지 (conapi.js)
import {
  fetchBtcChartDataFromDB,
  fetchIndicatorData,
  fetchGoldPriceData,
  fetchExchangeRateData,
  fetchCoinsFromServerAPI,
  fetchCoinUIData,
  formatScoreBasedWeatherData,
  fetchNews,
  fetchBoardPosts,
  formatApiTimestamp,
  weatherConditions,
  // COIN_LIST, getWeatherPrediction, getTechnicalIndicators 등은 conapi.js에서 관리되거나
  // 실제 API 호출로 대체되어야 합니다. 지금은 임시로 이전 파일의 구조를 따릅니다.
  // 이 부분은 프로젝트의 실제 API 연동 방식에 따라 달라집니다.
  // 만약 COIN_LIST 등이 conapi.js에서 export되지 않는다면, 해당 데이터 구조를 직접 정의하거나
  // API 호출로 대체해야 합니다.
} from "../app/api/conapi.js";

// _ChartHelpers.js에서 카테고리 축을 사용하는 차트 함수들만 임포트
import {
  createBtcPriceChart,
  createSimpleLineChart,
  createIndicatorChart,
  createMaChart,
} from "./_ChartHelpers.js";

let activeChartObjects = {};

function destroyAllActiveCharts() {
  for (const canvasId in activeChartObjects) {
    if (
      activeChartObjects[canvasId] &&
      typeof activeChartObjects[canvasId].destroy === "function"
    ) {
      try {
        activeChartObjects[canvasId].destroy();
      } catch (e) {
        console.error(`[CoinDetail] Error destroying chart ${canvasId}:`, e);
      }
    }
  }
  activeChartObjects = {};
}

// renderCoinDetailPage 함수는 paste-3.txt의 내용 중 차트 생성 부분을 수정
export async function renderCoinDetailPage(
  container,
  coinSymbolFromUrl = "BTC"
) {
  destroyAllActiveCharts();
  container.innerHTML = ""; // 이전 내용 삭제

  // API에서 코인 목록 가져오기 (실제 구현)
  // const COIN_LIST = await fetchCoinsFromServerAPI(); // conapi.js에 해당 함수가 있다고 가정
  // 지금은 임시 COIN_LIST 사용 (paste-3.txt 내용 기반)
  // 실제 프로젝트에서는 이부분을 fetchCoinsFromServerAPI() 등으로 대체해야 합니다.
  const TEMP_COIN_LIST_FOR_DEMO = [
    {
      rank: 1,
      name: "Bitcoin",
      symbol: "BTC",
      graphicSymbol: "₿", // 비트코인 그래픽 심볼
      apiSymbol: "BTCUSDT",
      price: "$67,890.45",
      change: "+2.34%",
    },
    {
      rank: 2,
      name: "Ethereum",
      symbol: "ETH",
      graphicSymbol: "Ξ", // 이더리움 그래픽 심볼
      apiSymbol: "ETHUSDT",
      price: "$3,456.78",
      change: "+1.23%",
    },
    {
      rank: 3,
      name: "Ripple",
      symbol: "XRP",
      graphicSymbol: "✕", // 리플 그래픽 심볼 (일반적으로 사용되는 X)
      apiSymbol: "XRPUSDT",
      price: "$1.23",
      change: "-0.45%",
    },
    {
      rank: 4,
      name: "Binance Coin",
      symbol: "BNB",
      graphicSymbol: "BNB", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
      apiSymbol: "BNBUSDT",
      price: "$456.78",
      change: "+0.89%",
    },
    {
      rank: 5,
      name: "Solana",
      symbol: "SOL",
      graphicSymbol: "SOL", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
      apiSymbol: "SOLUSDT",
      price: "$123.45",
      change: "+5.67%",
    },
    {
      rank: 6,
      name: "Dogecoin",
      symbol: "DOGE",
      graphicSymbol: "Ɖ", // 도지코인 그래픽 심볼
      apiSymbol: "DOGEUSDT",
      price: "$0.123",
      change: "-1.23%",
    },
    {
      rank: 7,
      name: "Cardano",
      symbol: "ADA",
      graphicSymbol: "₳", // 카르다노 그래픽 심볼
      apiSymbol: "ADAUSDT",
      price: "$0.456",
      change: "+0.78%",
    },
    {
      rank: 8,
      name: "TRON",
      symbol: "TRX",
      graphicSymbol: "TRX", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
      apiSymbol: "TRXUSDT",
      price: "$0.089",
      change: "-0.34%",
    },
    {
      rank: 9,
      name: "Shiba Inu",
      symbol: "SHIB",
      graphicSymbol: "SHIB", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
      apiSymbol: "SHIBUSDT",
      price: "$0.00002345",
      change: "+3.45%",
    },
    {
      rank: 10,
      name: "Litecoin",
      symbol: "LTC",
      graphicSymbol: "Ł", // 라이트코인 그래픽 심볼
      apiSymbol: "LTCUSDT",
      price: "$78.90",
      change: "-0.67%",
    },
    // ... 기타 코인들
  ];
  const coin =
    TEMP_COIN_LIST_FOR_DEMO.find((c) => c.symbol === coinSymbolFromUrl) ||
    TEMP_COIN_LIST_FOR_DEMO[0];
  // const currentPairForChart = coin.pair || `${coin.symbol}USDT`; // 차트용 pair
  const currentPairForChart = `${coinSymbolFromUrl}USDT`; // 차트용 pair

  const pageWrapper = document.createElement("div");
  pageWrapper.className = "coin-detail-page-wrapper";

  const stickyLeftPanel = document.createElement("div");
  stickyLeftPanel.className = "coin-detail-sticky-left-panel";

  // 좌측 패널 UI 데이터 가져오기
  const uiData = await fetchCoinUIData(currentPairForChart);
  const forecasts = formatScoreBasedWeatherData(uiData, coin.symbol);

  const header = document.createElement("div");
  header.className = "coin-detail-header";
  const title = document.createElement("h2");
  const displaySymbol = coin.graphicSymbol || coin.symbol;
  title.innerHTML = `<span class="coin-graphic-symbol-detail">${displaySymbol}</span> ${coin.name} (${coin.symbol})`;

  const price = document.createElement("div");
  price.className = "coin-detail-price";
  // uiData에서 현재 가격 가져오기
  const priceValue = uiData ? uiData.current_price : undefined;
  const priceText =
    priceValue !== undefined
      ? `$${parseFloat(priceValue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })}`
      : coin.price || "가격 정보 로딩 중..."; // coin.price는 임시 fallback
  price.textContent = `현재가: ${priceText}`;

  header.appendChild(title);
  header.appendChild(price);

  const weatherInfo = document.createElement("div");
  weatherInfo.className = "weather-forecast"; // CSS 클래스 유지
  const weatherSectionTitle = document.createElement("h3"); // 제목 추가
  weatherSectionTitle.textContent = `${coin.symbol} 일기예보`;
  weatherSectionTitle.style.cssText =
    "margin-top: 1rem; margin-bottom: 0.5rem; font-size: 1.1rem;";
  weatherInfo.appendChild(weatherSectionTitle);

  const weatherInfoContainer = document.createElement("div"); // 아이콘들을 담을 컨테이너
  weatherInfoContainer.className = "daily-weather-row";
  forecasts.forEach((forecast) => {
    const weatherDayBlock = document.createElement("div");
    weatherDayBlock.className = "weather-day-block";
    const dayLabel = document.createElement("div");
    dayLabel.className = "weather-day-label";
    if (forecast.day === "yesterday") dayLabel.textContent = "어제";
    else if (forecast.day === "today") dayLabel.textContent = "오늘";
    else if (forecast.day === "tomorrow") dayLabel.textContent = "내일";
    const weatherIcon = document.createElement("span");
    weatherIcon.className = "weather-day-icon";
    weatherIcon.textContent = forecast.icon;
    weatherIcon.title = forecast.tooltip;
    weatherDayBlock.appendChild(dayLabel);
    weatherDayBlock.appendChild(weatherIcon);
    weatherInfoContainer.appendChild(weatherDayBlock);
  });
  weatherInfo.appendChild(weatherInfoContainer);

  // 기술 지표 (MA, EMA 등)는 차트 영역으로 이동했으므로 여기서는 제거 또는 간략화
  // const indicators = getTechnicalIndicators(coin.symbol); // 이 함수는 더 이상 사용 안 함
  const technicalInfo = document.createElement("div");
  technicalInfo.className = "technical-indicators-summary"; // 클래스명 변경 또는 제거
  // technicalInfo.textContent = `MA, RSI 등 주요 지표는 차트에서 확인하세요.`;

  const returns = document.createElement("div");
  returns.className = "returns-info";
  const timeframes = ["24시간", "7일", "30일"];
  const change24hValue = uiData ? uiData.change_24h : undefined;
  const change24hText =
    change24hValue !== undefined
      ? `${parseFloat(change24hValue).toFixed(2)}%`
      : "N/A";
  const values = [change24hText, "+5.0%", "+10.0%"]; // 7일, 30일은 임시 데이터
  timeframes.forEach((time, index) => {
    const returnItem = document.createElement("div");
    returnItem.className = "return-item";
    returnItem.textContent = `${time}: ${values[index]}`;
    if (time === "24시간" && change24hValue !== undefined) {
      returnItem.style.color =
        parseFloat(change24hValue) >= 0
          ? "var(--profit-color)"
          : "var(--loss-color)";
    }
    returns.appendChild(returnItem);
  });

  // 날씨 범례 추가
  const legend = document.createElement("div");
  legend.className = "weather-legend";
  legend.style.marginTop = "1rem";
  legend.innerHTML = Object.entries(weatherConditions)
    .filter(([key]) => !isNaN(parseInt(key)))
    .sort(([keyA], [keyB]) => parseInt(keyB) - parseInt(keyA))
    .map(([score, details]) => {
      const stars = "⭐".repeat(parseInt(score));
      return `<div class="legend-item" style="font-size: 0.8rem; margin-bottom: 0.2rem;"><strong>${stars}</strong> &nbsp; ${details.label} ${details.icon}</div>`;
    })
    .join("");

  const buttonArea = document.createElement("div");
  buttonArea.className = "coin-detail-buttons";
  const predictButton = document.createElement("button");
  predictButton.textContent = "수익률 예측";
  predictButton.onclick = () =>
    (window.location.hash = `#prediction/${coin.symbol}`);
  const discussButton = document.createElement("button");
  discussButton.textContent = "토론방 이동";
  discussButton.onclick = () =>
    (window.location.hash = `#discussion/${coin.symbol}`);
  buttonArea.appendChild(predictButton);
  buttonArea.appendChild(discussButton);

  stickyLeftPanel.appendChild(header);
  stickyLeftPanel.appendChild(weatherInfo);
  // stickyLeftPanel.appendChild(technicalInfo); // 기술 지표 요약 제거 또는 수정
  stickyLeftPanel.appendChild(returns);
  stickyLeftPanel.appendChild(legend); // 날씨 범례 추가
  stickyLeftPanel.appendChild(buttonArea);
  pageWrapper.appendChild(stickyLeftPanel);

  // --- 오른쪽 콘텐츠 영역 (차트 및 뉴스) ---
  const rightContentArea = document.createElement("div");
  rightContentArea.className = "coin-detail-right-content-area";

  // 컬럼 구조는 paste-3.txt 원본 유지
  // 1. 첫 번째 컬럼: 코인 가격 차트 (MA 포함)
  const coinChartColumn = document.createElement("div");
  coinChartColumn.className = "coin-chart-column";
  coinChartColumn.style.display = "flex";
  coinChartColumn.style.flexDirection = "column";
  coinChartColumn.style.gap = "25px"; // ✅ 여기서 전체 차트 간 간격 벌리기

  const priceAndIndicatorCombinedChartArea = document.createElement("div");
  priceAndIndicatorCombinedChartArea.style.display = "flex";
  priceAndIndicatorCombinedChartArea.style.flexDirection = "column";
  priceAndIndicatorCombinedChartArea.style.height = "400px";
  priceAndIndicatorCombinedChartArea.className = "combined-chart-area-moved"; // CSS 클래스
  priceAndIndicatorCombinedChartArea.style.gap = "100px"; // gap 제거

  const priceAndIndicatorCombinedChartArea2 = document.createElement("div");
  priceAndIndicatorCombinedChartArea2.style.display = "flex";
  priceAndIndicatorCombinedChartArea2.style.flexDirection = "column";
  priceAndIndicatorCombinedChartArea2.style.height = "400px";
  priceAndIndicatorCombinedChartArea2.className = "combined-chart-area-moved"; // CSS 클래스

  const priceChartContainer = document.createElement("div");
  priceChartContainer.className = "price-chart-container";
  priceChartContainer.style.height = "100px"; // 여기서 크기 조절
  priceChartContainer.style.overflow = "hidden";

  const priceChartHeaderEl = document.createElement("div");
  priceChartHeaderEl.className = "chart-header";
  priceChartHeaderEl.innerHTML = `<h3><span class="coin-graphic-symbol-detail">${displaySymbol}</span> ${coin.name} 가격 변동 (라인)</h3>`; // 차트 타입 명시
  const priceChartOptions = document.createElement("div");
  priceChartOptions.className = "chart-options";
  // 캔들/라인 및 기간 버튼 (현재는 기능적으로 연결되지 않음, UI만 표시)
  // ["캔들", "라인"].forEach((type) => {
  //   const option = document.createElement("button");
  //   option.className =
  //     type === "라인" ? "chart-option selected" : "chart-option";
  //   option.textContent = type;
  //   priceChartOptions.appendChild(option);
  // });
  // ["1일", "1주", "1개월", "1년", "전체"].forEach((time) => {
  //   const option = document.createElement("button");
  //   option.className =
  //     time === "1개월" ? "time-option selected" : "time-option"; // 기본 선택
  //   option.textContent = time;
  //   priceChartOptions.appendChild(option);
  // });
  const priceCanvasWrapper = document.createElement("div");
  priceCanvasWrapper.className = "canvas-wrapper";
  priceCanvasWrapper.style.height = "100%"; // 내부 wrapper도 꽉 차게
  const priceChartCanvas = document.createElement("canvas");
  priceChartCanvas.id = "btcPriceChartCanvas"; // 이 ID로 createBtcPriceChart 호출
  priceChartCanvas.style.height = "100%"; // canvas 자체도 100% 높이
  priceChartCanvas.style.maxHeight = "300px"; // ✅ 강제 제한

  priceCanvasWrapper.appendChild(priceChartCanvas);
  priceChartContainer.appendChild(priceChartHeaderEl);
  priceChartContainer.appendChild(priceChartOptions);
  priceChartContainer.appendChild(priceCanvasWrapper);

  // 기술 지표 차트 부분 (MA 차트 표시)
  const indicatorChartContainer = document.createElement("div");
  indicatorChartContainer.className = "indicator-chart-container";
  const indicatorChartHeaderEl = document.createElement("h4");
  indicatorChartHeaderEl.textContent = "기술 지표";
  // const indicatorsTabs = document.createElement("div");
  // indicatorsTabs.className = "indicators-tabs";
  // const indicatorTypes = ["MA", "EMA", "RSI", "MACD"]; // EMA 등은 현재 미구현
  // indicatorTypes.forEach((indType) => {
  //   const tab = document.createElement("button");
  //   tab.className =
  //     indType === "MA" ? "indicator-tab selected" : "indicator-tab";
  //   tab.textContent = indType;
  //   tab.addEventListener("click", () => {
  //     indicatorsTabs
  //       .querySelectorAll(".indicator-tab")
  //       .forEach((t) => t.classList.remove("selected"));
  //     tab.classList.add("selected");

  //     if (
  //       activeChartObjects["indicatorChartCanvas"] &&
  //       typeof activeChartObjects["indicatorChartCanvas"].destroy === "function"
  //     ) {
  //       activeChartObjects["indicatorChartCanvas"].destroy();
  //       delete activeChartObjects["indicatorChartCanvas"];
  //     }
  //   });
  //   indicatorsTabs.appendChild(tab);
  // });
  const indicatorCanvasWrapper = document.createElement("div");
  indicatorCanvasWrapper.className = "canvas-wrapper";
  const indicatorChartCanvas = document.createElement("canvas");
  indicatorChartCanvas.id = "indicatorChartCanvas"; // 이 ID로 createMaChart 호출
  indicatorCanvasWrapper.appendChild(indicatorChartCanvas);
  indicatorChartContainer.appendChild(indicatorChartHeaderEl);
  // indicatorChartContainer.appendChild(indicatorsTabs);
  indicatorChartContainer.appendChild(indicatorCanvasWrapper);

  // 가격 차트만 담는 영역
  const priceChartArea = document.createElement("div");
  priceChartArea.className = "price-chart-area-separated";
  priceChartArea.style.border = "none";
  priceChartArea.style.marginBottom = "20px"; // 아래쪽 간격만 살림
  priceChartArea.appendChild(priceChartContainer);

  // 기술 지표 차트만 담는 영역
  const indicatorChartArea = document.createElement("div");
  indicatorChartArea.className = "indicator-chart-area-separated";
  indicatorChartArea.style.border = "none";
  indicatorChartArea.style.marginTop = "0px";
  indicatorChartArea.appendChild(indicatorChartContainer);

  // // 각각 별도로 coinChartColumn에 추가
  // coinChartColumn.appendChild(priceChartArea);
  // coinChartColumn.appendChild(indicatorChartArea);

  priceAndIndicatorCombinedChartArea.appendChild(priceChartContainer);
  priceAndIndicatorCombinedChartArea.style.display = "flex";
  priceAndIndicatorCombinedChartArea.style.flexDirection = "column";
  coinChartColumn.appendChild(priceAndIndicatorCombinedChartArea);

  priceAndIndicatorCombinedChartArea2.appendChild(indicatorChartContainer);
  priceAndIndicatorCombinedChartArea2.style.display = "flex";
  priceAndIndicatorCombinedChartArea2.style.flexDirection = "column";
  coinChartColumn.appendChild(priceAndIndicatorCombinedChartArea2);

  rightContentArea.appendChild(coinChartColumn);

  // 2. 두 번째 컬럼: 환율 및 금 시세 차트
  const otherAssetsColumn = document.createElement("div");
  otherAssetsColumn.className = "other-assets-column";

  const usdKrwChartArea = document.createElement("div");
  usdKrwChartArea.className = "usd-krw-chart-area-moved";
  const usdKrwChartHeaderEl = document.createElement("div");
  usdKrwChartHeaderEl.className = "chart-header";
  usdKrwChartHeaderEl.innerHTML = "<h3>USD/KRW 환율 변동</h3>";
  const usdKrwCanvasWrapper = document.createElement("div");
  usdKrwCanvasWrapper.className = "canvas-wrapper";
  const usdKrwChartCanvas = document.createElement("canvas");
  usdKrwChartCanvas.id = "usdKrwChartCanvas"; // 이 ID로 createSimpleLineChart 호출
  usdKrwCanvasWrapper.appendChild(usdKrwChartCanvas);
  usdKrwChartArea.appendChild(usdKrwChartHeaderEl);
  usdKrwChartArea.appendChild(usdKrwCanvasWrapper);
  otherAssetsColumn.appendChild(usdKrwChartArea);

  const goldPriceChartArea = document.createElement("div");
  goldPriceChartArea.className = "gold-price-chart-area-moved";
  const goldPriceChartHeaderEl = document.createElement("div");
  goldPriceChartHeaderEl.className = "chart-header";
  goldPriceChartHeaderEl.innerHTML = "<h3>금 시세 변동</h3>";
  const goldPriceCanvasWrapper = document.createElement("div");
  goldPriceCanvasWrapper.className = "canvas-wrapper";
  const goldPriceChartCanvas = document.createElement("canvas");
  goldPriceChartCanvas.id = "goldPriceChartCanvas"; // 이 ID로 createSimpleLineChart 호출
  goldPriceCanvasWrapper.appendChild(goldPriceChartCanvas);
  goldPriceChartArea.appendChild(goldPriceChartHeaderEl);
  goldPriceChartArea.appendChild(goldPriceCanvasWrapper);
  otherAssetsColumn.appendChild(goldPriceChartArea);
  rightContentArea.appendChild(otherAssetsColumn);

  // 3. 세 번째 컬럼: 뉴스 및 인기 게시글
  const newsColumnDetail = document.createElement("div");
  newsColumnDetail.className = "news-column-detail";
  const newsAndPostsStack = document.createElement("div");
  newsAndPostsStack.className = "news-posts-vertical-stack";

  // 뉴스 및 게시글은 실제 API 연동 필요
  const newsListContainer = await createNewsColumnFromAPI(
    coin.symbol,
    currentPairForChart
  );
  const postsListContainer = await createPostsColumnFromAPI(coin.symbol); // coinSymbol 전달
  newsAndPostsStack.appendChild(newsListContainer);
  newsAndPostsStack.appendChild(postsListContainer);
  newsColumnDetail.appendChild(newsAndPostsStack);
  rightContentArea.appendChild(newsColumnDetail);

  pageWrapper.appendChild(rightContentArea);
  container.appendChild(pageWrapper);

  // --- 차트 렌더링 호출 ---
  requestAnimationFrame(async () => {
    const target = document.querySelector(
      ".combined-chart-area-moved .indicator-chart-container"
    );
    if (target) {
      target.style.borderTop = "none";
      target.style.marginTop = "0px";
      target.style.paddingTop = "0px";
    }
    // DOM이 완전히 그려진 후 차트 생성
    try {
      // BTC 가격 차트 (라인) 생성
      const ohlcvData = await fetchBtcChartDataFromDB(currentPairForChart);
      const btcChart = createBtcPriceChart("btcPriceChartCanvas", ohlcvData);
      if (btcChart) {
        activeChartObjects["btcPriceChartCanvas"] = btcChart;
        // MA → 실제 API 데이터 기반으로 대체

        const indicatorData = await fetchIndicatorData(currentPairForChart);
        // console.log("[DEBUG] indicatorData = ", indicatorData);

        if (indicatorData && indicatorData.length > 0) {
          activeChartObjects["indicatorChartCanvas"] = createIndicatorChart(
            "indicatorChartCanvas",
            indicatorData
          );
        } else {
          console.warn("No indicator data available for chart.");
        }
      }

      // USD/KRW 및 금 시세 차트 생성
      const usdKrwData = await fetchExchangeRateData();
      if (usdKrwData && usdKrwData.length > 0) {
        const parsedUsdKrwData = usdKrwData
          .map((item) => ({
            x: new Date(item.rate_date), // 날짜
            y: parseFloat(item.rate), // 환율값 (예: 1333.20)
          }))
          .reverse(); // 최신 → 과거 순서일 경우, 뒤집기

        activeChartObjects["usdKrwChartCanvas"] = createSimpleLineChart(
          "usdKrwChartCanvas",
          "USD/KRW",
          parsedUsdKrwData,
          "steelblue"
        );
      } else {
        console.warn("환율 데이터가 없습니다.");
      }

      // activeChartObjects["usdKrwChartCanvas"] = createSimpleLineChart(
      //   "usdKrwChartCanvas",
      //   "USD/KRW",
      //   1200,
      //   1400
      // );

      const goldData = await fetchGoldPriceData();

      if (goldData && goldData.length > 0) {
        const parsedGoldData = goldData
          .map((item) => ({
            x: new Date(item.base_date), // 날짜 (시간 포함된 ISO 문자열)
            y: parseFloat(item.price_per_kilogram), // 금 1kg당 가격
          }))
          .reverse(); // ← 날짜 오름차순 정렬 (과거→현재)

        activeChartObjects["goldPriceChartCanvas"] = createSimpleLineChart(
          "goldPriceChartCanvas",
          "Gold Price per Kg (KRW)",
          parsedGoldData,
          "goldenrod"
        );
      } else {
        console.warn("금 시세 데이터가 없습니다.");
      }
      // activeChartObjects["goldPriceChartCanvas"] = createSimpleLineChart(
      //   "goldPriceChartCanvas",
      //   "Gold Price (USD)",
      //   1800,
      //   2500
      // );
    } catch (e) {
      console.error("Error rendering charts in CoinDetail.js:", e);
    }
  });
}

// --- createNewsColumnFromAPI 및 createPostsColumnFromAPI 함수 (이전 버전에서 가져옴, API 연동 필요) ---
async function createNewsColumnFromAPI(coinSymbol, coinPair) {
  const newsColumnDiv = document.createElement("div");
  newsColumnDiv.className = "news-section-in-detail";
  const newsHeader = document.createElement("h3");
  newsHeader.textContent = `${coinSymbol} 관련 뉴스`;
  newsColumnDiv.appendChild(newsHeader);

  const newsListEl = document.createElement("ul");
  newsListEl.className = "news-list";
  newsListEl.innerHTML = "<li>뉴스 로딩 중...</li>"; // 초기 메시지

  try {
    const newsData = await fetchNews({
      symbol: coinSymbol,
      pair: coinPair,
      limit: 5,
    });
    if (newsData && newsData.length > 0) {
      newsListEl.innerHTML = ""; // 로딩 메시지 제거
      newsData.forEach((item) => {
        const newsItemLi = document.createElement("li");
        newsItemLi.className = "news-item";
        const titleDiv = document.createElement("div");
        titleDiv.className = "news-title";
        const newsLink = document.createElement("a");
        newsLink.href = item.url;
        newsLink.textContent = item.title;
        newsLink.target = "_blank";
        newsLink.rel = "noopener noreferrer";
        titleDiv.appendChild(newsLink);
        const timeDiv = document.createElement("div");
        timeDiv.className = "news-time";
        timeDiv.textContent = `(${formatApiTimestamp(
          item.publishtime || item.publish_time,
          false
        )})`;
        newsItemLi.appendChild(titleDiv);
        newsItemLi.appendChild(timeDiv);
        newsListEl.appendChild(newsItemLi);
      });
    } else if (newsData === null) {
      // API 호출 실패
      newsListEl.innerHTML =
        "<li class='news-item error-message'>뉴스 정보를 가져오지 못했습니다.</li>";
    } else {
      // 데이터는 있으나 내용이 없는 경우
      newsListEl.innerHTML = "<li class='news-item'>관련 뉴스가 없습니다.</li>";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    newsListEl.innerHTML =
      "<li class='news-item error-message'>뉴스 로딩 중 오류 발생.</li>";
  }
  newsColumnDiv.appendChild(newsListEl);
  return newsColumnDiv;
}

async function createPostsColumnFromAPI(currentCoinSymbol) {
  const postsColumnDiv = document.createElement("div");
  postsColumnDiv.className = "posts-section-in-detail";
  const postsHeader = document.createElement("h3");
  postsHeader.textContent = "최신 게시글";
  postsColumnDiv.appendChild(postsHeader);

  const postsListEl = document.createElement("ul");
  postsListEl.className = "posts-list";
  postsListEl.innerHTML = "<li>게시글 로딩 중...</li>"; // 초기 메시지

  try {
    const postData = await fetchBoardPosts({
      limit: 3,
      coinSymbol: currentCoinSymbol,
    });
    if (postData && postData.length > 0) {
      postsListEl.innerHTML = ""; // 로딩 메시지 제거
      postData.forEach((item) => {
        const postItemLi = document.createElement("li");
        postItemLi.className = "post-item";
        postItemLi.style.cursor = "pointer";
        postItemLi.addEventListener("click", () => {
          window.location.hash = `#post/${item.postid}`;
        });
        const titleDiv = document.createElement("div");
        titleDiv.className = "post-title";
        titleDiv.textContent = item.title;
        const timeDiv = document.createElement("div");
        timeDiv.className = "post-time";
        timeDiv.textContent = `(조회수: ${
          item.viewcount || 0
        } / ${formatApiTimestamp(item.createdat, false)})`;
        postItemLi.appendChild(titleDiv);
        postItemLi.appendChild(timeDiv);
        postsListEl.appendChild(postItemLi);
      });
    } else if (postData === null) {
      // API 호출 실패
      postsListEl.innerHTML =
        "<li class='post-item error-message'>게시글 정보를 가져오지 못했습니다.</li>";
    } else {
      // 데이터는 있으나 내용이 없는 경우
      const message = currentCoinSymbol
        ? `${currentCoinSymbol} 관련 게시글이 없습니다.`
        : "게시글이 없습니다.";
      postsListEl.innerHTML = `<li class='post-item'>${message}</li>`;
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    postsListEl.innerHTML =
      "<li class='post-item error-message'>게시글 로딩 중 오류 발생.</li>";
  }
  postsColumnDiv.appendChild(postsListEl);

  const moreLink = document.createElement("a");
  moreLink.className = "more-link";
  moreLink.textContent = "토론방 더 보기";
  moreLink.href = `#discussion/${currentCoinSymbol || "ALL"}`; // currentCoinSymbol이 없으면 전체 토론방
  postsColumnDiv.appendChild(moreLink);

  return postsColumnDiv;
}
