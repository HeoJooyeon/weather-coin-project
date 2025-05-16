import {
  COIN_LIST,
  getTechnicalIndicators,
  getFearGreedIndex,
  getFearGreedLabel,
  getFearGreedEmoji,
} from "../app/api/conapi.js";

export function renderPredictionPage(container, coinSymbol = "") {
  // 컨테이너 초기화
  container.innerHTML = "";

  // 예측 페이지 컨테이너
  const predictionContainer = document.createElement("div");
  predictionContainer.className = "prediction-container";

  // 헤더 영역
  const header = document.createElement("header");
  header.className = "prediction-header";

  const title = document.createElement("h2");
  title.textContent = "수익률 예측";
  header.appendChild(title);

  const description = document.createElement("p");
  description.className = "prediction-description";
  description.textContent =
    "코인 데이터와 기술적 지표를 분석하여 미래 가격 움직임을 예측합니다.";
  header.appendChild(description);

  // 코인 선택 영역
  const coinSelector = document.createElement("div");
  coinSelector.className = "coin-selector";

  const selectorLabel = document.createElement("label");
  selectorLabel.textContent = "코인 선택:";
  coinSelector.appendChild(selectorLabel);

  const select = document.createElement("select");
  select.id = "coin-select";

  // 기본 선택 옵션
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "코인을 선택하세요";
  select.appendChild(defaultOption);

  // 코인 목록 추가
  COIN_LIST.forEach((coin) => {
    const option = document.createElement("option");
    option.value = coin.symbol;
    option.textContent = `${coin.name} (${coin.symbol})`;
    // 기존 코인 심볼이 있다면 선택
    if (coin.symbol === coinSymbol) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  coinSelector.appendChild(select);

  // 예측 기간 선택
  const periodSelector = document.createElement("div");
  periodSelector.className = "period-selector";

  const periodLabel = document.createElement("label");
  periodLabel.textContent = "예측 기간:";
  periodSelector.appendChild(periodLabel);

  const periodOptions = ["24시간", "7일", "30일", "3개월"];

  periodOptions.forEach((period) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "prediction-period";
    radio.id = `period-${period}`;
    radio.value = period;
    radio.checked = period === "24시간";

    const radioLabel = document.createElement("label");
    radioLabel.htmlFor = `period-${period}`;
    radioLabel.textContent = period;

    periodSelector.appendChild(radio);
    periodSelector.appendChild(radioLabel);
  });

  // 예측 결과 영역
  const resultArea = document.createElement("div");
  resultArea.className = "prediction-results";
  resultArea.style.display = "none"; // 처음에는 숨김

  // 예측 버튼
  const predictButton = document.createElement("button");
  predictButton.className = "predict-button";
  predictButton.textContent = "예측하기";
  predictButton.addEventListener("click", () => {
    const selectedCoin = select.value;
    if (!selectedCoin) {
      alert("코인을 선택해주세요");
      return;
    }

    // 선택된 라디오 버튼 찾기
    const selectedPeriod = document.querySelector(
      'input[name="prediction-period"]:checked',
    ).value;

    // 예측 결과 표시
    showPredictionResults(resultArea, selectedCoin, selectedPeriod);
  });

  // 요소 추가
  predictionContainer.appendChild(header);
  predictionContainer.appendChild(coinSelector);
  predictionContainer.appendChild(periodSelector);
  predictionContainer.appendChild(predictButton);
  predictionContainer.appendChild(resultArea);

  container.appendChild(predictionContainer);
}

function showPredictionResults(resultArea, coinSymbol, period) {
  // 코인 정보 가져오기
  const coin = COIN_LIST.find((c) => c.symbol === coinSymbol);
  const indicators = getTechnicalIndicators();
  const fearGreed = getFearGreedIndex();

  // 랜덤 예측값 생성
  const predictionValue = (Math.random() * 20 - 10).toFixed(2);
  const predictionDirection = predictionValue > 0 ? "상승" : "하락";
  const confidenceScore = Math.floor(Math.random() * 41) + 60; // 60-100 사이의 랜덤값

  // 결과 영역 초기화 및 표시
  resultArea.innerHTML = "";
  resultArea.style.display = "block";

  // 예측 결과 헤더
  const resultHeader = document.createElement("h3");
  resultHeader.className = "result-header";
  resultHeader.textContent = `${coin.name} (${coin.symbol}) ${period} 예측 결과`;
  resultArea.appendChild(resultHeader);

  // 예측 주요 결과
  const mainResult = document.createElement("div");
  mainResult.className = "main-result";
  mainResult.innerHTML = `
    <div class="prediction-value ${predictionValue > 0 ? "positive" : "negative"}">
      ${predictionValue > 0 ? "+" : ""}${predictionValue}%
    </div>
    <div class="prediction-description">
      ${period} 후 예상 ${predictionDirection} (신뢰도: ${confidenceScore}%)
    </div>
  `;
  resultArea.appendChild(mainResult);

  // 예측 근거
  const reasoningSection = document.createElement("div");
  reasoningSection.className = "prediction-reasoning";

  const reasoningHeader = document.createElement("h4");
  reasoningHeader.textContent = "예측 근거";
  reasoningSection.appendChild(reasoningHeader);

  const reasoningList = document.createElement("ul");

  const reasons = [
    `RSI 지표 ${Math.round(indicators.rsi)} - ${indicators.rsi > 70 ? "과매수" : indicators.rsi < 30 ? "과매도" : "중립"} 상태`,
    `MACD 지표 ${indicators.macd.toFixed(2)} - ${indicators.macd > 0 ? "상승" : "하락"} 신호`,
    `시장 공포/탐욕 지수 ${fearGreed} - ${getFearGreedLabel(fearGreed)}`,
    `이동평균선 분석 - ${Math.random() > 0.5 ? "골든크로스 임박" : "데드크로스 임박"}`,
    `거래량 분석 - ${Math.random() > 0.5 ? "최근 증가세" : "감소세"}`,
  ];

  reasons.forEach((reason) => {
    const item = document.createElement("li");
    item.textContent = reason;
    reasoningList.appendChild(item);
  });

  reasoningSection.appendChild(reasoningList);
  resultArea.appendChild(reasoningSection);

  // 면책 조항
  const disclaimer = document.createElement("div");
  disclaimer.className = "prediction-disclaimer";
  disclaimer.textContent =
    "※ 이 예측은 기술적 분석에 기반하며 투자 조언이 아닙니다. 투자의 책임은 본인에게 있습니다.";
  resultArea.appendChild(disclaimer);
}
