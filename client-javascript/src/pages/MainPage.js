// src/pages/MainPage.js

import {
  fetchCoinsFromServerAPI,
  fetchCoinUIData,
  formatScoreBasedWeatherData,
  fetchCoinPriceHistory, // 이 함수는 conapi.js에 정의된 대로 데이터를 가져옴
  fetchFearGreedIndexData,
  getFearGreedLabelFromAPI,
  getFearGreedEmojiFromAPI,
} from "../app/api/conapi.js";

const MAIN_CHART_SVG_CONTAINER_ID = "mainPageCoinPriceSvgContainer";

// SVG 기반 코인 가격 이력 그래프 생성 함수 (신규 또는 대체)
function createCoinPriceHistorySVG(containerId, priceHistoryData, coinSymbol) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[SVGChart] Container with id ${containerId} not found.`);
    return;
  }
  // 이전analysisNoteOld SVG 내용 지우기
  container.innerHTML = "";

  if (!priceHistoryData || priceHistoryData.length < 2) {
    // 최소 2개의 데이터 포인트 필요
    const message = document.createElement("p");
    message.textContent = `${coinSymbol} 7일치 지표 데이터 부족`;
    message.style.textAlign = "center";
    message.style.padding = "20px";
    message.style.color = "var(--text-secondary)";
    container.appendChild(message);
    console.log(
      `[SVGChart] Not enough data to display chart for ${coinSymbol}`,
    );
    return;
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const width = container.clientWidth || 300; // 컨테이너 너비 또는 기본값
  const height = 150; // 고정 높이
  svg.setAttribute("width", "100%"); // 부모 너비에 맞춤
  svg.setAttribute("height", height.toString());
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.display = "block"; // inline 기본값으로 인한 여백 제거

  // 데이터 포인트 추출 (가격만)
  const dataPoints = priceHistoryData.map((item) => parseFloat(item.price));
  const minPrice = Math.min(...dataPoints);
  const maxPrice = Math.max(...dataPoints);
  const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice; // 0으로 나누기 방지

  const padding = 5; // SVG 내부 여백

  // Polyline 포인트 문자열 생성
  const points = dataPoints
    .map((price, index) => {
      const x =
        ((width - 2 * padding) / (dataPoints.length - 1)) * index + padding;
      const y =
        height -
        padding -
        ((price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  const polyline = document.createElementNS(svgNS, "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "var(--primary-color)");
  polyline.setAttribute("stroke-width", "2");
  polyline.setAttribute("stroke-linecap", "round");
  polyline.setAttribute("stroke-linejoin", "round");

  svg.appendChild(polyline);
  container.appendChild(svg);
  console.log(`[SVGChart] SVG chart created for ${coinSymbol}`);
}

// 호버 시 차트 업데이트를 위한 플래그 및 타임아웃 ID (디바운싱 유사 효과)
let svgChartUpdateTimeoutId = null;
let isSVGChartLoading = false; // SVG 차트 로딩 상태

async function updateHoverSVGChart(pair, symbol) {
  if (isSVGChartLoading) {
    return;
  }
  isSVGChartLoading = true;

  const chartTitleEl = document.getElementById("coinPriceHistoryTitle");
  const svgContainer = document.getElementById(MAIN_CHART_SVG_CONTAINER_ID);

  if (chartTitleEl) chartTitleEl.textContent = `${symbol} 7일 지표 추이`;

  if (svgContainer) {
    svgContainer.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-secondary);">${symbol} 데이터 로딩 중...</p>`;
  }

  try {
    const historyData = await fetchCoinPriceHistory(pair);
    createCoinPriceHistorySVG(MAIN_CHART_SVG_CONTAINER_ID, historyData, symbol);
  } catch (error) {
    console.error(
      `[SVGChart] Error fetching or creating SVG chart for ${symbol}:`,
      error,
    );
    if (svgContainer) {
      svgContainer.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-secondary);">차트 로딩 오류 (${symbol})</p>`;
    }
  } finally {
    isSVGChartLoading = false;
  }
}

export async function renderMainPage(container) {
  console.log("Render MainPage called");
  isSVGChartLoading = false; // 로딩 플래그 초기화
  if (svgChartUpdateTimeoutId) {
    clearTimeout(svgChartUpdateTimeoutId);
    svgChartUpdateTimeoutId = null;
  }

  container.innerHTML = "";

  const main = document.createElement("div");
  main.className = "main-content";

  const left = document.createElement("div");
  left.className = "left-panel";
  const leftTitle = document.createElement("h3");
  leftTitle.textContent = "코인 일기예보";
  left.appendChild(leftTitle);
  const coinListContainer = document.createElement("div");
  coinListContainer.className = "coin-list-container";
  left.appendChild(coinListContainer);
  coinListContainer.innerHTML =
    "<p class='loading-message'>코인 목록을 불러오는 중...</p>";

  const right = document.createElement("div");
  right.className = "right-panel";

  const coinPriceHistoryPanel = document.createElement("div");
  coinPriceHistoryPanel.className = "coin-price-history-panel";
  const coinPriceHistoryHeader = document.createElement("div");
  coinPriceHistoryHeader.className = "coin-price-history-header";
  const coinPriceHistoryTitle = document.createElement("div");
  coinPriceHistoryTitle.id = "coinPriceHistoryTitle";
  coinPriceHistoryTitle.textContent = "코인 7일 지표 추이";
  coinPriceHistoryTitle.className = "coin-price-history-title";
  coinPriceHistoryHeader.appendChild(coinPriceHistoryTitle);

  // SVG 그래프를 담을 div 컨테이너로 변경
  const coinPriceSvgContainer = document.createElement("div");
  coinPriceSvgContainer.id = MAIN_CHART_SVG_CONTAINER_ID;
  coinPriceSvgContainer.style.width = "100%";
  coinPriceSvgContainer.style.height = "150px"; // SVG 높이와 동일하게 설정
  coinPriceHistoryPanel.appendChild(coinPriceHistoryHeader);
  coinPriceHistoryPanel.appendChild(coinPriceSvgContainer);
  right.appendChild(coinPriceHistoryPanel);

  const fearGreedPanel = document.createElement("div");
  fearGreedPanel.className = "fear-greed-panel";
  fearGreedPanel.innerHTML =
    "<p class='loading-message small'>공포/탐욕 지수 로딩 중...</p>";
  right.appendChild(fearGreedPanel);

  // 공포 탐욕 지수 렌더링 (이전과 동일)
  (async () => {
    try {
      const fngData = await fetchFearGreedIndexData();
      const fearGreedIndexValue = parseInt(fngData.value, 10);
      const fearGreedClassification = fngData.value_classification;
      fearGreedPanel.innerHTML = "";
      // ... (UI 생성 로직) ...
      const fearGreedHeader = document.createElement("div");
      fearGreedHeader.className = "fear-greed-header";
      const fearGreedTitleEl = document.createElement("div");
      fearGreedTitleEl.textContent = "공포와 탐욕 지수";
      fearGreedTitleEl.className = "fear-greed-title";
      const fgValueAndStatusContainer = document.createElement("div");
      fgValueAndStatusContainer.className = "fear-greed-current-value-status";
      const fearGreedValueSmall = document.createElement("div");
      fearGreedValueSmall.textContent = fearGreedIndexValue;
      fearGreedValueSmall.className = "fear-greed-value-small";
      const fearGreedStatusTextSmall = document.createElement("div");
      fearGreedStatusTextSmall.textContent = getFearGreedLabelFromAPI(
        fearGreedClassification,
      );
      fearGreedStatusTextSmall.className = "fear-greed-status-small";
      fgValueAndStatusContainer.appendChild(fearGreedValueSmall);
      fgValueAndStatusContainer.appendChild(fearGreedStatusTextSmall);
      fearGreedHeader.appendChild(fearGreedTitleEl);
      fearGreedHeader.appendChild(fgValueAndStatusContainer);
      fearGreedPanel.appendChild(fearGreedHeader);
      const fearGreedContent = document.createElement("div");
      fearGreedContent.className = "fear-greed-content";
      const fearGreedInfo = document.createElement("div");
      fearGreedInfo.className = "fear-greed-info";
      const emojiDisplay = document.createElement("div");
      emojiDisplay.className = "fear-greed-emoji-display";
      emojiDisplay.textContent = getFearGreedEmojiFromAPI(
        fearGreedClassification,
      );
      const fearGreedValueDisplay = document.createElement("div");
      fearGreedValueDisplay.className = "fear-greed-value-display";
      fearGreedValueDisplay.textContent = fearGreedIndexValue;
      const statusDisplayText = document.createElement("div");
      statusDisplayText.className = "fear-greed-status-display-text";
      statusDisplayText.textContent = getFearGreedLabelFromAPI(
        fearGreedClassification,
      );
      fearGreedInfo.appendChild(emojiDisplay);
      fearGreedInfo.appendChild(fearGreedValueDisplay);
      fearGreedInfo.appendChild(statusDisplayText);
      const fearGreedGraph = document.createElement("div");
      fearGreedGraph.className = "fear-greed-graph";
      const gauge = document.createElement("div");
      gauge.className = "fear-greed-gauge";
      const indicator = document.createElement("div");
      indicator.className = "fear-greed-indicator";
      indicator.style.left = `${fearGreedIndexValue}%`;
      gauge.appendChild(indicator);
      const labels = document.createElement("div");
      labels.className = "fear-greed-labels";
      const fearLabel = document.createElement("span");
      fearLabel.textContent =
        getFearGreedEmojiFromAPI("Extreme Fear") +
        " " +
        getFearGreedLabelFromAPI("Extreme Fear");
      const neutralLabel = document.createElement("span");
      neutralLabel.textContent =
        getFearGreedEmojiFromAPI("Neutral") +
        " " +
        getFearGreedLabelFromAPI("Neutral");
      const greedLabel = document.createElement("span");
      greedLabel.textContent =
        getFearGreedEmojiFromAPI("Extreme Greed") +
        " " +
        getFearGreedLabelFromAPI("Extreme Greed");
      labels.appendChild(fearLabel);
      labels.appendChild(neutralLabel);
      labels.appendChild(greedLabel);
      fearGreedGraph.appendChild(gauge);
      fearGreedGraph.appendChild(labels);
      fearGreedContent.appendChild(fearGreedInfo);
      fearGreedContent.appendChild(fearGreedGraph);
      fearGreedPanel.appendChild(fearGreedContent);
    } catch (error) {
      console.error("공포/탐욕 지수 UI 업데이트 중 오류:", error);
      fearGreedPanel.innerHTML =
        "<p class='error-message small'>공포/탐욕 지수 로딩 실패</p>";
    }
  })();

  // 코인 목록 및 차트 관련 로직
  (async () => {
    try {
      const coinsFromAPI = await fetchCoinsFromServerAPI();
      console.log("API에서 가져온 코인 목록:", coinsFromAPI);

      const svgContainer = document.getElementById(MAIN_CHART_SVG_CONTAINER_ID);

      if (coinsFromAPI && coinsFromAPI.length > 0) {
        coinListContainer.innerHTML = "";

        // 초기 그래프 로드 (첫 번째 코인)
        if (coinsFromAPI[0] && svgContainer) {
          await updateHoverSVGChart(
            coinsFromAPI[0].pair,
            coinsFromAPI[0].symbol,
          );
        }

        for (const coin of coinsFromAPI) {
          const pairToUse = coin.pair;
          const coinItem = document.createElement("div");
          coinItem.className = "coin-item";
          coinItem.style.cursor = "pointer";
          coinItem.addEventListener("click", () => {
            window.location.hash = `coin/${coin.symbol}`;
          });

          coinItem.addEventListener("mouseover", () => {
            if (svgChartUpdateTimeoutId) {
              clearTimeout(svgChartUpdateTimeoutId);
            }
            if (isSVGChartLoading) return;

            svgChartUpdateTimeoutId = setTimeout(() => {
              updateHoverSVGChart(pairToUse, coin.symbol);
              svgChartUpdateTimeoutId = null;
            }, 100);
          });

          // ... (코인 정보 DOM 생성 부분은 이전과 동일)
          const coinInfoRow = document.createElement("div");
          coinInfoRow.className = "coin-info-row";
          const coinSymbolName = document.createElement("div");
          coinSymbolName.className = "coin-symbol-name";
          const symbolDisplay = document.createElement("span");
          symbolDisplay.className = "coin-item-symbol";
          if (coin.logo_url) {
            const img = document.createElement("img");
            img.src = coin.logo_url;
            img.alt = coin.symbol;
            img.style.width = "16px";
            img.style.height = "16px";
            img.style.marginRight = "5px";
            symbolDisplay.appendChild(img);
            symbolDisplay.append(coin.symbol);
          } else {
            symbolDisplay.textContent = `${coin.graphicSymbol || coin.symbol}`;
          }
          const nameDisplay = document.createElement("span");
          nameDisplay.className = "coin-item-name";
          nameDisplay.textContent = ` ${coin.name}`;
          coinSymbolName.appendChild(symbolDisplay);
          coinSymbolName.appendChild(nameDisplay);
          coinInfoRow.appendChild(coinSymbolName);

          const uiData = await fetchCoinUIData(pairToUse);

          const price = document.createElement("div");
          price.className = "coin-price";
          if (
            uiData &&
            uiData.current_price !== undefined &&
            uiData.current_price !== 0
          ) {
            price.textContent = `$${parseFloat(uiData.current_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
          } else {
            price.textContent = "N/A";
          }
          coinInfoRow.appendChild(price);

          const change = document.createElement("div");
          change.className = "coin-change";
          if (uiData && uiData.change_24h !== undefined) {
            const changeValue = parseFloat(uiData.change_24h);
            change.textContent = !isNaN(changeValue)
              ? `${changeValue.toFixed(2)}%`
              : "0.00%";
            change.style.color =
              !isNaN(changeValue) && changeValue >= 0
                ? "var(--profit-color)"
                : "var(--loss-color)";
            if (changeValue === 0) change.style.color = "var(--text-secondary)";
          } else {
            change.textContent = "0.00%";
            change.style.color = "var(--text-secondary)";
          }
          coinInfoRow.appendChild(change);
          coinItem.appendChild(coinInfoRow);

          const dailyWeatherRow = document.createElement("div");
          dailyWeatherRow.className = "daily-weather-row";
          const forecasts = formatScoreBasedWeatherData(uiData, coin.symbol);
          if (forecasts) {
            forecasts.forEach((forecast) => {
              const weatherDayBlock = document.createElement("div");
              weatherDayBlock.className = "weather-day-block";
              const dayLabel = document.createElement("div");
              dayLabel.className = "weather-day-label";
              if (forecast.day === "yesterday") dayLabel.textContent = "어제";
              else if (forecast.day === "today") dayLabel.textContent = "오늘";
              else if (forecast.day === "tomorrow")
                dayLabel.textContent = "내일";
              const weatherIcon = document.createElement("span");
              weatherIcon.className = "weather-day-icon";
              weatherIcon.textContent = forecast.icon;
              weatherIcon.title = forecast.tooltip;
              weatherDayBlock.appendChild(dayLabel);
              weatherDayBlock.appendChild(weatherIcon);
              dailyWeatherRow.appendChild(weatherDayBlock);
            });
          } else {
            dailyWeatherRow.textContent = "날씨 정보를 가져올 수 없습니다.";
          }
          coinItem.appendChild(dailyWeatherRow);
          coinListContainer.appendChild(coinItem);
        }
      } else {
        coinListContainer.innerHTML =
          "<p class='info-message'>표시할 코인 정보가 없습니다.</p>";
        if (svgContainer) {
          svgContainer.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-secondary);">코인 정보를 가져올 수 없습니다.</p>`;
        }
      }
    } catch (error) {
      console.error("메인 페이지 코인 목록 렌더링 오류:", error);
      coinListContainer.innerHTML = `<p class='error-message'>코인 목록을 불러오는 데 실패했습니다: ${error.message}</p>`;
      const svgContainer = document.getElementById(MAIN_CHART_SVG_CONTAINER_ID);
      if (svgContainer) {
        svgContainer.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-secondary);">차트 로딩 중 오류 발생</p>`;
      }
    }
  })();

  // ... (analysisNote, ctaButtons DOM 생성은 이전과 동일)
  // const analysisNote = document.createElement("div");
  // analysisNote.className = "analysis-note";
  // analysisNote.textContent =
  //   "* 날씨 아이콘은 각 날짜의 예상 변동성을 나타냅니다.";
  // left.appendChild(analysisNote);
  //
  // const ctaButtons = document.createElement("div");
  // ctaButtons.className = "cta-buttons";
  // const predictBtn = document.createElement("button");
  // predictBtn.textContent = "수익률 예측";
  // predictBtn.onclick = () => (window.location.hash = "prediction");
  // const discussBtn = document.createElement("button");
  // discussBtn.textContent = "종목토론";
  // discussBtn.onclick = () => (window.location.hash = "discussion");
  // ctaButtons.appendChild(predictBtn);
  // ctaButtons.appendChild(discussBtn);
  // left.appendChild(ctaButtons);
  //// 2. 새로운 weather-legend 요소 생성 (output_20250519_200039_1.txt의 MainPage.js 참고)
  const legend = document.createElement("div");
  legend.className = "weather-legend"; // CSS 스타일 일치 필요
  legend.innerHTML = `
      <div class="legend-item"><strong>⭐⭐⭐⭐⭐</strong> • 맑음 ☀️ </div>
      <div class="legend-item"><strong>⭐⭐⭐⭐</strong> • 구름 조금 ⛅ </div>
      <div class="legend-item"><strong>⭐⭐⭐</strong> • 흐림 ☁️ </div>
      <div class="legend-item"><strong>⭐⭐</strong> • 비 🌧️ </div>
      <div class="legend-item"><strong>⭐</strong> • 낙뢰 ⛈️ </div>
    `;
  // 기존 analysis-note가 있던 위치에 weather-legend 추가 (코인 리스트 다음)
  left.appendChild(legend);

  // 3. 기존 analysis-note를 CTA 버튼이 있던 위치로 이동
  const analysisNote = document.createElement("div");
  analysisNote.className = "analysis-note";
  analysisNote.textContent =
    "* 날씨 아이콘은 각 날짜의 예상 변동성을 나타냅니다.";
  // weather-legend 다음, (제거된) CTA 버튼 위치에 analysis-note 추가
  left.appendChild(analysisNote);

  // <<<--- 요청된 변경 사항 적용 끝 --- >>>

  // 비동기 함수 즉시 실행
  main.appendChild(left);
  main.appendChild(right);

  container.appendChild(main);
}
