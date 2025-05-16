
// pages/_ChartHelpers.js

// 임시 캔들스틱 데이터 생성 (날짜, 시, 고, 저, 종) - 카테고리 축용
function generateCandlestickData(count = 60) {
  const data = [];
  let date = new Date();
  date.setDate(date.getDate() - count);
  let lastClose = 50000 + Math.random() * 10000;

  for (let i = 0; i < count; i++) {
    const open = lastClose + (Math.random() - 0.5) * 1000;
    const close = open + (Math.random() - 0.5) * 2000;
    const high = Math.max(open, close) + Math.random() * 500;
    const low = Math.min(open, close) - Math.random() * 500;
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateLabel = `${month}/${day}`;
    
    data.push({
      x: dateLabel, 
      o: open,
      h: high,
      l: low,
      c: close,
    });
    lastClose = close;
    date.setDate(date.getDate() + 1);
  }
  return data;
}

// 임시 MA 데이터 생성 (캔들스틱 데이터 기반) - 카테고리 축용
function calculateMA(ohlcData, period = 10) {
  const maData = [];
  if (!ohlcData || ohlcData.length < period) return maData;
  
  for (let i = period - 1; i < ohlcData.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      // ohlcData의 각 요소에 'c'(종가) 속성이 있어야 함
      if (typeof ohlcData[i - j].c === 'undefined') {
        console.error("calculateMA: ohlcData item is missing 'c' property.", ohlcData[i-j]);
        return []; // 에러 발생 시 빈 배열 반환
      }
      sum += ohlcData[i - j].c; 
    }
    maData.push({
      x: ohlcData[i].x, // 동일한 x축 카테고리 사용
      y: sum / period,
    });
  }
  return maData;
}


// 임시 라인 차트 데이터 생성 - 카테고리 축용 (환율, 금 시세용)
function generateLineData(count = 60, minVal = 1000, maxVal = 1500) {
  const data = [];
  let date = new Date();
  date.setDate(date.getDate() - count);

  for (let i = 0; i < count; i++) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateLabel = `${month}/${day}`;
    
    data.push({
      x: dateLabel, 
      y: Math.random() * (maxVal - minVal) + minVal,
    });
    date.setDate(date.getDate() + 1);
  }
  return data;
}

// 비트코인 가격 차트 (라인 차트로 변경) 생성 함수 - 카테고리 축 사용
export function createBtcPriceChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas with id ${canvasId} not found for BTC Price Chart.`);
    return null;
  }
  const ctx = canvas.getContext("2d");

  // MA 계산을 위해 전체 OHLC 데이터 생성
  const candlestickRawData = generateCandlestickData(60); 
  // 라인 차트를 위해 종가(c)만 활용
  const lineChartData = candlestickRawData.map(d => ({ x: d.x, y: d.c }));

  const chart = new Chart(ctx, {
    type: "line", // 차트 타입을 'line'으로 변경
    data: {
      datasets: [
        {
          label: "Bitcoin Price (Close)", // 라벨 변경
          data: lineChartData, // 가공된 라인 차트 데이터 사용
          borderColor: "rgb(54, 162, 235)", // 라인 색상 예시
          tension: 0.1, // 라인 곡률
          borderWidth: 2, // 라인 두께
          pointRadius: 1, // 데이터 포인트 크기
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
        },
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
  // MA 차트 생성 시 원본 OHLC 데이터를 사용하기 위해 차트 객체에 저장
  chart._fullCandlestickDataForMA = candlestickRawData; 
  return chart; 
}

// MA(이동평균선) 차트 생성 함수 (기술 지표 영역용)
export function createMaChart(canvasId, basePriceData, period = 10, label = `MA (${period})`) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas with id ${canvasId} not found for MA Chart.`);
    return null;
  }
  // basePriceData는 OHLC 형태여야 하며, 각 요소는 'x'와 'c' 속성을 가져야 함
  if (!basePriceData || basePriceData.length === 0 || typeof basePriceData[0].c === 'undefined' || typeof basePriceData[0].x === 'undefined') {
    console.warn(`No valid basePriceData (missing 'c' or 'x' property, or empty) provided for MA chart on ${canvasId}`);
    return null;
  }
  const ctx = canvas.getContext("2d");

  const maData = calculateMA(basePriceData, period); 

  if (maData.length === 0) {
    console.warn(`Not enough data to calculate MA (${period}) for ${canvasId}. MA Data length: ${maData.length}, Base Data length: ${basePriceData.length}`);
    // MA 데이터가 비어있어도 빈 차트를 그릴 수 있도록 하거나, null을 반환하여 아예 그리지 않도록 할 수 있음
    // 여기서는 빈 데이터셋으로 차트를 생성하도록 허용 (Chart.js가 빈 데이터 처리)
  }

  return new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: label,
          data: maData, 
          borderColor: "orange", 
          borderWidth: 1.5,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          // x축 레이블은 maData에 포함된 x값을 사용
        },
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
}

// 단순 라인 차트 생성 함수 (환율, 금 시세용) - 카테고리 축 사용
export function createSimpleLineChart(canvasId, label, minVal, maxVal) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas with id ${canvasId} not found for Simple Line Chart.`);
    return null;
  }
  const ctx = canvas.getContext("2d");
  const lineData = generateLineData(60, minVal, maxVal);
  return new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: label,
          data: lineData,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
        },
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}
