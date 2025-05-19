
// pages/CoinDetail.js

import {
  COIN_LIST,
  getWeatherPrediction,
  getTechnicalIndicators,
} from "../app/api/conapi.js";
import { createBtcPriceChart, createSimpleLineChart, createMaChart } from "./_ChartHelpers.js";

let activeChartObjects = {};

function destroyAllActiveCharts() {
  for (const canvasId in activeChartObjects) {
    if (activeChartObjects[canvasId] && typeof activeChartObjects[canvasId].destroy === 'function') {
      try {
        activeChartObjects[canvasId].destroy();
      } catch (e) {
        console.error(`Error destroying chart ${canvasId}:`, e);
      }
    }
  }
  activeChartObjects = {};
}

export function renderCoinDetailPage(container, coinSymbol = "BTC") {
  destroyAllActiveCharts();
  container.innerHTML = "";
  const coin = COIN_LIST.find((c) => c.symbol === coinSymbol) || COIN_LIST[0];

  const pageWrapper = document.createElement("div");
  pageWrapper.className = "coin-detail-page-wrapper";

  // --- 왼쪽 고정 정보 패널 ---
  const stickyLeftPanel = document.createElement("div");
  stickyLeftPanel.className = "coin-detail-sticky-left-panel";
  
  const header = document.createElement("div");
  header.className = "coin-detail-header";
  const title = document.createElement("h2");
  const displaySymbol = coin.graphicSymbol || coin.symbol;
  title.innerHTML = `<span class="coin-graphic-symbol-detail">${displaySymbol}</span> ${coin.name} (${coin.symbol})`;
  const price = document.createElement("div");
  price.className = "coin-detail-price";
  price.textContent = `현재가: ${coin.price || "₩90,000,000"}`;
  header.appendChild(title);
  header.appendChild(price);

  const weatherInfo = document.createElement("div");
  weatherInfo.className = "weather-forecast";
  const forecasts = getWeatherPrediction(coin.symbol);
  forecasts.forEach((forecast) => {
    const dayForecast = document.createElement("div");
    dayForecast.className = "day-forecast";
    let dayLabelText = "";
    if (forecast.day === "yesterday") dayLabelText = "어제";
    else if (forecast.day === "today") dayLabelText = "오늘";
    else if (forecast.day === "tomorrow") dayLabelText = "내일";
    dayForecast.textContent = `${dayLabelText} ${forecast.icon}`;
    weatherInfo.appendChild(dayForecast);
  });

  const indicators = getTechnicalIndicators(coin.symbol);
  const technicalInfo = document.createElement("div");
  technicalInfo.className = "technical-indicators";
  technicalInfo.textContent = `MA: ${Math.round(indicators.ma)} / EMA: ${Math.round(indicators.ema)} / RSI: ${Math.round(indicators.rsi)} / MACD: ${Math.round(indicators.macd)}`;

  const returns = document.createElement("div");
  returns.className = "returns-info";
  const timeframes = ["24시간", "7일", "30일"];
  const values = ["+2.2%", "+5.0%", "+10.0%"];
  timeframes.forEach((time, index) => {
    const returnItem = document.createElement("div");
    returnItem.className = "return-item";
    returnItem.textContent = `${time}: ${values[index]}`;
    returns.appendChild(returnItem);
  });

  // 요청 1: returns-info 아래에 추가 영역 확보
  const tempInfoPlaceholder = document.createElement("div");
  tempInfoPlaceholder.className = "temp-info-placeholder";
  tempInfoPlaceholder.innerHTML = `
    <h4>임시 정보 영역</h4>
    <p>여기에 추가적인 정보나 컴포넌트가 표시될 수 있습니다.</p>
    <ul>
      <li>항목 1</li>
      <li>항목 2</li>
    </ul>
  `;

  // 요청 1: 수익률 예측과, 토론방 이동 버튼을 아래로 이동.
  const buttonArea = document.createElement("div");
  buttonArea.className = "coin-detail-buttons";
  const predictButton = document.createElement("button");
  predictButton.textContent = "수익률 예측";
  predictButton.onclick = () => (window.location.hash = `#prediction/${coin.symbol}`);
  const discussButton = document.createElement("button");
  discussButton.textContent = "토론방 이동";
  discussButton.onclick = () => (window.location.hash = `#discussion/${coin.symbol}`);
  buttonArea.appendChild(predictButton);
  buttonArea.appendChild(discussButton);

  stickyLeftPanel.appendChild(header);
  stickyLeftPanel.appendChild(weatherInfo);
  stickyLeftPanel.appendChild(technicalInfo);
  stickyLeftPanel.appendChild(returns);
  stickyLeftPanel.appendChild(tempInfoPlaceholder); // 임시 영역 추가
  stickyLeftPanel.appendChild(buttonArea); // 버튼 영역을 임시 영역 아래로 이동
  pageWrapper.appendChild(stickyLeftPanel);

  // --- 오른쪽 콘텐츠 영역 (차트 및 뉴스) ---
  const rightContentArea = document.createElement("div");
  rightContentArea.className = "coin-detail-right-content-area";

  // 1. 첫 번째 컬럼: 코인 가격 차트 (MA 제외)
  const coinChartColumn = document.createElement("div");
  coinChartColumn.className = "coin-chart-column";

  const priceAndIndicatorCombinedChartArea = document.createElement("div");
  priceAndIndicatorCombinedChartArea.className = "combined-chart-area-moved";

  const priceChartContainer = document.createElement("div");
  priceChartContainer.className = "price-chart-container";
  const priceChartHeaderEl = document.createElement("div");
  priceChartHeaderEl.className = "chart-header";
  priceChartHeaderEl.innerHTML = `<h3><span class="coin-graphic-symbol-detail">${displaySymbol}</span> ${coin.name} 가격 변동</h3>`;
  const priceChartOptions = document.createElement("div");
  priceChartOptions.className = "chart-options";
  // 초기에는 '라인' 차트를 선택된 것으로 표시 (현재 라인차트 기본)
  ["캔들", "라인"].forEach((type) => {
    const option = document.createElement("button");
    option.className = type === "라인" ? "chart-option selected" : "chart-option";
    option.textContent = type;
    // TODO: 캔들/라인 차트 전환 로직 추가 필요
    priceChartOptions.appendChild(option);
  });
  ["1일", "1주", "1개월", "1년", "전체"].forEach((time) => {
    const option = document.createElement("button");
    option.className = time === "1개월" ? "time-option selected" : "time-option";
    option.textContent = time;
    priceChartOptions.appendChild(option);
  });

  const priceCanvasWrapper = document.createElement("div");
  priceCanvasWrapper.className = "canvas-wrapper";
  const priceChartCanvas = document.createElement("canvas");
  priceChartCanvas.id = "btcPriceChartCanvas";
  priceCanvasWrapper.appendChild(priceChartCanvas);
  priceChartContainer.appendChild(priceChartHeaderEl);
  priceChartContainer.appendChild(priceChartOptions);
  priceChartContainer.appendChild(priceCanvasWrapper);

  // 기술 지표 차트 부분 (MA 차트 표시)
  const indicatorChartContainer = document.createElement("div");
  indicatorChartContainer.className = "indicator-chart-container";
  const indicatorChartHeaderEl = document.createElement("h4");
  indicatorChartHeaderEl.textContent = "기술 지표";
  const indicatorsTabs = document.createElement("div");
  indicatorsTabs.className = "indicators-tabs";
  const indicatorTypes = ["MA", "EMA", "RSI", "MACD"];
  indicatorTypes.forEach((indType) => {
    const tab = document.createElement("button");
    tab.className = indType === "MA" ? "indicator-tab selected" : "indicator-tab";
    tab.textContent = indType;
    tab.addEventListener('click', () => {
        indicatorsTabs.querySelectorAll('.indicator-tab').forEach(t => t.classList.remove('selected'));
        tab.classList.add('selected');
        
        if (activeChartObjects['indicatorChartCanvas'] && typeof activeChartObjects['indicatorChartCanvas'].destroy === 'function') {
            activeChartObjects['indicatorChartCanvas'].destroy();
            delete activeChartObjects['indicatorChartCanvas'];
        }

        const btcPriceChart = activeChartObjects['btcPriceChartCanvas'];
        if (indType === 'MA' && btcPriceChart && btcPriceChart._fullCandlestickDataForMA) {
             const btcOhlcDataForMA = btcPriceChart._fullCandlestickDataForMA;
             activeChartObjects['indicatorChartCanvas'] = createMaChart('indicatorChartCanvas', btcOhlcDataForMA, 10);
        } else if (btcPriceChart) { // 다른 지표는 _fullCandlestickDataForMA가 필요 없을 수도 있음
            console.log(`${indType} chart selected, but not implemented yet. Or btcPriceChartCanvas or its data is missing for MA.`);
            // 다른 지표 차트 로직 (예: createRsiChart(indicatorChartCanvas, btcPriceChart._fullCandlestickDataForMA); )
        } else {
            console.warn("BTC Price Chart is not available for indicator calculation.");
        }
    });
    indicatorsTabs.appendChild(tab);
  });
  const indicatorCanvasWrapper = document.createElement("div");
  indicatorCanvasWrapper.className = "canvas-wrapper";
  const indicatorChartCanvas = document.createElement("canvas");
  indicatorChartCanvas.id = "indicatorChartCanvas";
  indicatorCanvasWrapper.appendChild(indicatorChartCanvas);
  indicatorChartContainer.appendChild(indicatorChartHeaderEl);
  indicatorChartContainer.appendChild(indicatorsTabs);
  indicatorChartContainer.appendChild(indicatorCanvasWrapper);

  priceAndIndicatorCombinedChartArea.appendChild(priceChartContainer);
  priceAndIndicatorCombinedChartArea.appendChild(indicatorChartContainer);
  coinChartColumn.appendChild(priceAndIndicatorCombinedChartArea);
  rightContentArea.appendChild(coinChartColumn);

  // 2. 두 번째 컬럼: 환율 및 금 시세 차트
  const otherAssetsColumn = document.createElement("div");
  otherAssetsColumn.className = "other-assets-column";
  
  const usdKrwChartArea = document.createElement("div");
  usdKrwChartArea.className = "usd-krw-chart-area-moved"; // 이 클래스에 높이 및 스크롤 적용
  const usdKrwChartHeaderEl = document.createElement("div");
  usdKrwChartHeaderEl.className = "chart-header";
  usdKrwChartHeaderEl.innerHTML = "<h3>USD/KRW 환율 변동</h3>";
  const usdKrwCanvasWrapper = document.createElement("div");
  usdKrwCanvasWrapper.className = "canvas-wrapper";
  const usdKrwChartCanvas = document.createElement("canvas");
  usdKrwChartCanvas.id = "usdKrwChartCanvas";
  usdKrwCanvasWrapper.appendChild(usdKrwChartCanvas);
  usdKrwChartArea.appendChild(usdKrwChartHeaderEl);
  usdKrwChartArea.appendChild(usdKrwCanvasWrapper);
  otherAssetsColumn.appendChild(usdKrwChartArea);

  const goldPriceChartArea = document.createElement("div");
  goldPriceChartArea.className = "gold-price-chart-area-moved"; // 이 클래스에 높이 및 스크롤 적용
  const goldPriceChartHeaderEl = document.createElement("div");
  goldPriceChartHeaderEl.className = "chart-header";
  goldPriceChartHeaderEl.innerHTML = "<h3>금 시세 변동</h3>";
  const goldPriceCanvasWrapper = document.createElement("div");
  goldPriceCanvasWrapper.className = "canvas-wrapper";
  const goldPriceChartCanvas = document.createElement("canvas");
  goldPriceChartCanvas.id = "goldPriceChartCanvas";
  goldPriceCanvasWrapper.appendChild(goldPriceChartCanvas);
  goldPriceChartArea.appendChild(goldPriceChartHeaderEl);
  goldPriceChartArea.appendChild(goldPriceCanvasWrapper);
  otherAssetsColumn.appendChild(goldPriceChartArea);
  rightContentArea.appendChild(otherAssetsColumn);
  
  // 3. 세 번째 컬럼: 뉴스 및 인기 게시글
  const newsColumnDetail = document.createElement("div");
  newsColumnDetail.className = "news-column-detail";
  const newsAndPostsStack = document.createElement("div");
  newsAndPostsStack.className = "news-posts-vertical-stack"; // 이 클래스에 높이 및 스크롤 적용
  const newsList = createNewsColumn();
  const postsList = createPostsColumn();
  newsAndPostsStack.appendChild(newsList);
  newsAndPostsStack.appendChild(postsList);
  newsColumnDetail.appendChild(newsAndPostsStack);
  rightContentArea.appendChild(newsColumnDetail);

  pageWrapper.appendChild(rightContentArea);
  container.appendChild(pageWrapper);

  // --- 차트 렌더링 호출 ---
  try {
    const btcChart = createBtcPriceChart('btcPriceChartCanvas');
    if (btcChart) {
      activeChartObjects['btcPriceChartCanvas'] = btcChart;
      if (btcChart._fullCandlestickDataForMA) {
        activeChartObjects['indicatorChartCanvas'] = createMaChart('indicatorChartCanvas', btcChart._fullCandlestickDataForMA, 10);
      } else {
        console.warn("Could not retrieve full OHLC data from BTC price chart for MA calculation.");
      }
    }
    
    activeChartObjects['usdKrwChartCanvas'] = createSimpleLineChart('usdKrwChartCanvas', 'USD/KRW', 1200, 1400);
    activeChartObjects['goldPriceChartCanvas'] = createSimpleLineChart('goldPriceChartCanvas', 'Gold Price (USD)', 1800, 2500);
  } catch (e) {
    console.error("Error rendering charts in CoinDetail.js:", e);
  }
}

// createNewsColumn, createPostsColumn 함수는 이전과 동일하게 유지
function createNewsColumn() {
  const newsColumnDiv = document.createElement("div");
  newsColumnDiv.className = "news-section-in-detail";
  const newsHeader = document.createElement("h3");
  newsHeader.textContent = "최신 뉴스";
  newsColumnDiv.appendChild(newsHeader);

  const newsListEl = document.createElement("ul");
  newsListEl.className = "news-list";
  const newsItems = [
    { title: "비트코인 사상 최고가 경신", time: "10분 전" },
    { title: "ETF 승인 소식", time: "1시간 전" },
    { title: "시장 분석 리포트", time: "3시간 전" },
    { title: "기관 투자 증가", time: "5시간 전" },
    { title: "규제 이슈", time: "1일 전" },
  ];
  newsItems.forEach((item) => {
    const newsItem = document.createElement("li");
    newsItem.className = "news-item";
    const title = document.createElement("div");
    title.className = "news-title";
    title.textContent = item.title;
    const time = document.createElement("div");
    time.className = "news-time";
    time.textContent = `(${item.time})`;
    newsItem.appendChild(title);
    newsItem.appendChild(time);
    newsListEl.appendChild(newsItem);
  });
  newsColumnDiv.appendChild(newsListEl);
  return newsColumnDiv;
}

function createPostsColumn() {
  const postsColumnDiv = document.createElement("div");
  postsColumnDiv.className = "posts-section-in-detail";

  const postsHeader = document.createElement("h3");
  postsHeader.textContent = "인기 게시글";
  postsColumnDiv.appendChild(postsHeader);

  const postsListEl = document.createElement("ul");
  postsListEl.className = "posts-list";
  const postItems = [
    { title: "BTC 전망 토론", time: "2시간 전" },
    { title: "비트코인 과대평가?", time: "5시간 전" },
    { title: "매매전략 공유", time: "1일 전" },
  ];
  postItems.forEach((item) => {
    const postItem = document.createElement("li");
    postItem.className = "post-item";
    const title = document.createElement("div");
    title.className = "post-title";
    title.textContent = item.title;
    const time = document.createElement("div");
    time.className = "post-time";
    time.textContent = `(${item.time})`;
    postItem.appendChild(title);
    postItem.appendChild(time);
    postsListEl.appendChild(postItem);
  });
  const moreLink = document.createElement("a");
  moreLink.className = "more-link";
  moreLink.textContent = "더 보기";
  const currentCoinSymbol = (window.location.hash.split("/")[1] || "BTC");
  moreLink.href = `#discussion/${currentCoinSymbol}`;
  postsColumnDiv.appendChild(postsListEl);
  postsColumnDiv.appendChild(moreLink);
  return postsColumnDiv;
}
