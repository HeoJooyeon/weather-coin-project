// src/pages/MainPage.js

import {
  fetchCoinsFromServerAPI,
  fetchCoinWeatherData,
  formatWeatherData,
  weatherIcons,
  getWeatherIcon, // 이제 export된 함수
  getWeatherLabel, // 이제 export된 함수
  getMarketCapHistory,
  getFearGreedIndex,
  getFearGreedLabel,
  getFearGreedEmoji,
} from "../app/api/conapi.js";

// 시가총액 차트 생성 함수
function createMarketCapChart() {
  const chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chart.setAttribute("class", "market-cap-chart");
  chart.setAttribute("viewBox", "0 0 100 60");

  const { data } = getMarketCapHistory();
  const points = data
    .map(
      (val, i) =>
        `${i * (100 / (data.length - 1))},${60 - (val / Math.max(...data)) * 50}`,
    )
    .join(" ");

  const polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline",
  );
  polyline.setAttribute("points", points);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "var(--loss-color)");
  polyline.setAttribute("stroke-width", "1");
  chart.appendChild(polyline);

  return chart;
}

export async function renderMainPage(container) {
  container.innerHTML = "";

  const main = document.createElement("div");
  main.className = "main-content";

  // 좌측 패널 (코인 일기예보)
  const left = document.createElement("div");
  left.className = "left-panel";

  const leftTitle = document.createElement("h3");
  leftTitle.textContent = "코인 일기예보";
  left.appendChild(leftTitle);

  const coinListContainer = document.createElement("div");
  coinListContainer.className = "coin-list-container";
  left.appendChild(coinListContainer);

  // 로딩 메시지 표시
  coinListContainer.innerHTML =
    "<p class='loading-message'>코인 목록을 불러오는 중...</p>";

  try {
    // 코인 목록 가져오기
    const coinsFromAPI = await fetchCoinsFromServerAPI();
    console.log("API에서 가져온 코인 목록:", coinsFromAPI);

    if (coinsFromAPI && coinsFromAPI.length > 0) {
      // 로딩 메시지 제거
      coinListContainer.innerHTML = "";

      // 각 코인에 대한 정보 표시
      for (const coin of coinsFromAPI) {
        // pair 값 확인
        const pairToUse = coin.pair || `${coin.symbol}USDT`;
        console.log(`코인 ${coin.symbol}의 pair 값:`, pairToUse);

        // 코인 아이템 요소 생성
        const coinItem = document.createElement("div");
        coinItem.className = "coin-item";
        coinItem.style.cursor = "pointer";
        coinItem.addEventListener("click", () => {
          window.location.hash = `coin/${coin.symbol}`;
        });

        // 코인 기본 정보 행
        const coinInfoRow = document.createElement("div");
        coinInfoRow.className = "coin-info-row";

        // 코인 심볼과 이름
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
          symbolDisplay.textContent = coin.symbol;
        }

        const nameDisplay = document.createElement("span");
        nameDisplay.className = "coin-item-name";
        nameDisplay.textContent = ` ${coin.name}`;

        coinSymbolName.appendChild(symbolDisplay);
        coinSymbolName.appendChild(nameDisplay);
        coinInfoRow.appendChild(coinSymbolName);

        // 코인 가격과 날씨 데이터 가져오기
        const weatherData = await fetchCoinWeatherData(pairToUse);
        console.log(`코인 ${coin.symbol}의 날씨 데이터:`, weatherData);

        // 가격 표시
        const price = document.createElement("div");
        price.className = "coin-price";

        if (weatherData && weatherData.current_price) {
          price.textContent = `$${parseFloat(
            weatherData.current_price,
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8,
          })}`;
        } else {
          price.textContent = "N/A";
        }
        coinInfoRow.appendChild(price);

        // 변동률 표시
        const change = document.createElement("div");
        change.className = "coin-change";

        if (weatherData && weatherData.change_24h !== undefined) {
          const changeValue = parseFloat(weatherData.change_24h);
          change.textContent = !isNaN(changeValue)
            ? `${changeValue.toFixed(2)}%`
            : "0%";
          change.style.color =
            !isNaN(changeValue) && changeValue > 0
              ? "var(--profit-color)"
              : "var(--loss-color)";
        } else {
          change.textContent = "0%";
        }
        coinInfoRow.appendChild(change);
        coinItem.appendChild(coinInfoRow);

        // 날씨 정보 표시
        const dailyWeatherRow = document.createElement("div");
        dailyWeatherRow.className = "daily-weather-row";

        // 날씨 데이터 포맷팅
        let forecasts = null;

        if (weatherData) {
          // 날씨 데이터가 있을 경우
          if (weatherData.weather_today) {
            console.log(
              `${coin.symbol}의 오늘 날씨:`,
              weatherData.weather_today,
            );
          }

          forecasts = formatWeatherData(weatherData, coin.symbol);
        }

        // 기본 날씨 데이터
        if (!forecasts) {
          forecasts = [
            {
              day: "yesterday",
              icon: "❓",
              label: "알 수 없음",
              tooltip: `${coin.symbol} 어제: 정보 없음`,
            },
            {
              day: "today",
              icon: "❓",
              label: "알 수 없음",
              tooltip: `${coin.symbol} 오늘: 정보 없음`,
            },
            {
              day: "tomorrow",
              icon: "❓",
              label: "알 수 없음",
              tooltip: `${coin.symbol} 내일: 정보 없음`,
            },
          ];
        }

        // 날씨 요소 생성
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
          dailyWeatherRow.appendChild(weatherDayBlock);
        });

        coinItem.appendChild(dailyWeatherRow);
        coinListContainer.appendChild(coinItem);
      }
    } else {
      coinListContainer.innerHTML =
        "<p class='info-message'>표시할 코인 정보가 없습니다.</p>";
    }
  } catch (error) {
    console.error("메인 페이지 코인 목록 렌더링 오류:", error);
    coinListContainer.innerHTML = `<p class='error-message'>코인 목록을 불러오는 데 실패했습니다: ${error.message}</p>`;
  }

  // 분석 노트
  const analysisNote = document.createElement("div");
  analysisNote.className = "analysis-note";
  analysisNote.textContent =
    "* 날씨 아이콘은 각 날짜의 예상 변동성을 나타냅니다.";
  left.appendChild(analysisNote);

  // CTA 버튼 영역
  const ctaButtons = document.createElement("div");
  ctaButtons.className = "cta-buttons";

  const predictBtn = document.createElement("button");
  predictBtn.textContent = "예측하기";
  predictBtn.onclick = () => (window.location.hash = "prediction");

  const discussBtn = document.createElement("button");
  discussBtn.textContent = "토론방";
  discussBtn.onclick = () => (window.location.hash = "discussion");

  ctaButtons.appendChild(predictBtn);
  ctaButtons.appendChild(discussBtn);
  left.appendChild(ctaButtons);

  // 우측 패널
  const right = document.createElement("div");
  right.className = "right-panel";

  // 시가 총액 패널
  const marketCapPanel = document.createElement("div");
  marketCapPanel.className = "market-cap-panel";
  const marketCapHeader = document.createElement("div");
  marketCapHeader.className = "market-cap-header";
  const marketCapTitle = document.createElement("div");
  marketCapTitle.textContent = "시가 총액";
  marketCapTitle.className = "market-cap-title";
  const marketCapValueContainer = document.createElement("div");
  marketCapValueContainer.className = "market-cap-value-container";
  const marketCapValue = document.createElement("div");
  marketCapValue.textContent = "데이터 로딩 중...";
  marketCapValue.className = "market-cap-value";
  const marketCapChange = document.createElement("div");
  marketCapChange.textContent = "...";
  marketCapChange.className = "market-cap-change";
  marketCapValueContainer.appendChild(marketCapValue);
  marketCapValueContainer.appendChild(marketCapChange);
  marketCapHeader.appendChild(marketCapTitle);
  marketCapHeader.appendChild(marketCapValueContainer);
  const marketCapChartSVG = createMarketCapChart();
  marketCapPanel.appendChild(marketCapHeader);
  marketCapPanel.appendChild(marketCapChartSVG);

  // 공포 탐욕 지수 패널
  const fearGreedPanel = document.createElement("div");
  fearGreedPanel.className = "fear-greed-panel";
  const fearGreedHeader = document.createElement("div");
  fearGreedHeader.className = "fear-greed-header";

  const fearGreedTitle = document.createElement("div");
  fearGreedTitle.textContent = "공포와 탐욕";
  fearGreedTitle.className = "fear-greed-title";

  const fearGreedIndexValue = getFearGreedIndex();
  const fgValueAndStatusContainer = document.createElement("div");
  fgValueAndStatusContainer.className = "fear-greed-current-value-status";

  const fearGreedValueSmall = document.createElement("div");
  fearGreedValueSmall.textContent = fearGreedIndexValue;
  fearGreedValueSmall.className = "fear-greed-value-small";

  const fearGreedStatusTextSmall = document.createElement("div");
  fearGreedStatusTextSmall.textContent = getFearGreedLabel(fearGreedIndexValue);
  fearGreedStatusTextSmall.className = "fear-greed-status-small";

  fgValueAndStatusContainer.appendChild(fearGreedValueSmall);
  fgValueAndStatusContainer.appendChild(fearGreedStatusTextSmall);

  fearGreedHeader.appendChild(fearGreedTitle);
  fearGreedHeader.appendChild(fgValueAndStatusContainer);
  fearGreedPanel.appendChild(fearGreedHeader);
  const fearGreedContent = document.createElement("div");
  fearGreedContent.className = "fear-greed-content";

  const fearGreedInfo = document.createElement("div");
  fearGreedInfo.className = "fear-greed-info";

  const emojiDisplay = document.createElement("div");
  emojiDisplay.className = "fear-greed-emoji-display";
  emojiDisplay.textContent = getFearGreedEmoji(fearGreedIndexValue);

  const fearGreedValueDisplay = document.createElement("div");
  fearGreedValueDisplay.className = "fear-greed-value-display";
  fearGreedValueDisplay.textContent = fearGreedIndexValue;

  const statusDisplayText = document.createElement("div");
  statusDisplayText.className = "fear-greed-status-display-text";
  statusDisplayText.textContent = getFearGreedLabel(fearGreedIndexValue);

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
  fearLabel.textContent = "😨 극도의 공포";
  const neutralLabel = document.createElement("span");
  neutralLabel.textContent = "😐 중립";
  const greedLabel = document.createElement("span");
  greedLabel.textContent = "🤩 극도의 탐욕";
  labels.appendChild(fearLabel);
  labels.appendChild(neutralLabel);
  labels.appendChild(greedLabel);

  fearGreedGraph.appendChild(gauge);
  fearGreedGraph.appendChild(labels);

  fearGreedContent.appendChild(fearGreedInfo);
  fearGreedContent.appendChild(fearGreedGraph);
  fearGreedPanel.appendChild(fearGreedContent);

  right.appendChild(marketCapPanel);
  right.appendChild(fearGreedPanel);

  main.appendChild(left);
  main.appendChild(right);

  container.appendChild(main);
}
