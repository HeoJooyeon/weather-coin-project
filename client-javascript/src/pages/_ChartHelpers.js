// src/pages/_ChartHelpers.js
import Chart from "chart.js/auto";
// 'chartjs-adapter-date-fns'와 'chartjs-chart-financial' 라이브러리는
// 이 파일에서 직접 사용되지 않더라도, Chart.js가 특정 차트 타입(예: candlestick)이나
// 시간 축(time)을 올바르게 처리하기 위해 프로젝트 레벨에 설치되어 있어야 할 수 있습니다.
// 만약 "category" 축만 사용한다면 필수는 아닐 수 있습니다.

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
    const dateLabel = `${month}/${day}`; // "월/일" 형식의 레이블

    data.push({
      x: dateLabel, // 카테고리 축을 위한 x 값
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
  if (!ohlcData || ohlcData.length < period) {
    console.warn(
      `calculateMA: Not enough data. Need ${period}, got ${ohlcData ? ohlcData.length : 0}`,
    );
    return maData;
  }

  for (let i = period - 1; i < ohlcData.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      if (typeof ohlcData[i - j].c === "undefined") {
        console.error(
          "calculateMA: ohlcData item is missing 'c' property.",
          ohlcData[i - j],
        );
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
    const dateLabel = `${month}/${day}`; // "월/일" 형식의 레이블

    data.push({
      x: dateLabel, // 카테고리 축을 위한 x 값
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
    console.error(
      `[ChartHelper] Canvas with id ${canvasId} not found for BTC Price Chart.`,
    );
    return null;
  }
  const ctx = canvas.getContext("2d");

  // MA 계산을 위해 전체 OHLC 데이터 생성
  const candlestickRawData = generateCandlestickData(60);
  // 라인 차트를 위해 종가(c)만 활용
  const lineChartData = candlestickRawData.map((d) => ({ x: d.x, y: d.c }));

  const chart = new Chart(ctx, {
    type: "line", // 차트 타입을 'line'으로 변경
    data: {
      // x축 레이블은 data.labels 또는 각 dataset의 data 객체 내 x 속성으로 제공
      // 여기서는 dataset의 data 객체 내 x 속성을 사용하므로 labels는 생략 가능
      datasets: [
        {
          label: "Bitcoin Price (Close)", // 라벨 변경
          data: lineChartData, // 가공된 라인 차트 데이터 사용 (객체 배열 형태 {x: label, y: value})
          borderColor: "rgb(54, 162, 235)",
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
          type: "category", // x축 타입을 'category'로 명시
          // labels: lineChartData.map(d => d.x) // category 축일 때 labels를 명시적으로 제공해도 됨
          // 아니면 dataset의 data 객체 x 속성으로 자동 인식
          ticks: {
            font: { family: "NeoDunggeunmoPro-Regular", size: 10 },
            color: "var(--text-secondary)",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 7,
          },
          grid: { display: false },
        },
        y: {
          beginAtZero: false,
          ticks: {
            font: { family: "NeoDunggeunmoPro-Regular" },
            color: "var(--text-secondary)",
            callback: (value) => `$${value.toLocaleString()}`,
          },
          grid: { color: "var(--border-color-soft)" },
        },
      },
      plugins: {
        legend: {
          display: true, // 범례 표시
          position: "top",
          labels: {
            font: { family: "NeoDunggeunmoPro-Regular" },
            color: "var(--text-secondary)",
          },
        },
        tooltip: {
          enabled: true,
          titleFont: { family: "NeoDunggeunmoPro-Regular" },
          bodyFont: { family: "NeoDunggeunmoPro-Regular" },
        },
      },
    },
  });
  // MA 차트 생성 시 원본 OHLC 데이터를 사용하기 위해 차트 객체에 저장
  chart._fullCandlestickDataForMA = candlestickRawData;
  return chart;
}

// MA(이동평균선) 차트 생성 함수 (기술 지표 영역용)
export function createMaChart(
  canvasId,
  basePriceData,
  period = 10,
  label = `MA (${period})`,
) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(
      `[ChartHelper] Canvas with id ${canvasId} not found for MA Chart.`,
    );
    return null;
  }
  // basePriceData는 OHLC 형태여야 하며, 각 요소는 'x'와 'c' 속성을 가져야 함
  if (
    !basePriceData ||
    basePriceData.length === 0 ||
    typeof basePriceData[0].c === "undefined" ||
    typeof basePriceData[0].x === "undefined"
  ) {
    console.warn(
      `[ChartHelper] No valid basePriceData (missing 'c' or 'x' property, or empty) provided for MA chart on ${canvasId}. Will not render MA chart.`,
    );
    // MA 차트 생성을 위한 데이터가 부적절하면 null 반환하여 차트 생성 시도 중단
    return null;
  }
  const ctx = canvas.getContext("2d");

  const maData = calculateMA(basePriceData, period);

  if (maData.length === 0) {
    console.warn(
      `[ChartHelper] Not enough data to calculate MA (${period}) for ${canvasId}. MA Data length: ${maData.length}, Base Data length: ${basePriceData.length}. MA Chart will be empty.`,
    );
    // MA 데이터가 비어있어도 빈 차트를 그릴 수 있도록 데이터셋을 비워둘 수 있음
  }

  return new Chart(ctx, {
    type: "line",
    data: {
      // labels: maData.map(d => d.x), // 카테고리 축이므로, x값은 data 객체에서 가져옴
      datasets: [
        {
          label: label,
          data: maData, // 객체 배열 형태 {x: label, y: value}
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
          type: "category", // x축 타입을 'category'로 명시
          // labels: maData.map(d => d.x), // 이 축은 주로 메인 차트와 공유되므로 labels는 메인 차트 따름
          display: false, // MA 차트는 보통 메인 차트 위에 겹쳐지므로 X축은 숨김
        },
        y: {
          beginAtZero: false,
          ticks: {
            font: { family: "NeoDunggeunmoPro-Regular" },
            color: "var(--text-secondary)",
          },
          grid: { color: "var(--border-color-soft)" },
        },
      },
      plugins: {
        legend: {
          display: true, // MA 차트도 범례 표시 가능 (예: MA(10))
          position: "top",
          labels: {
            font: { family: "NeoDunggeunmoPro-Regular" },
            color: "var(--text-secondary)",
          },
        },
        tooltip: {
          enabled: true,
          titleFont: { family: "NeoDunggeunmoPro-Regular" },
          bodyFont: { family: "NeoDunggeunmoPro-Regular" },
        },
      },
    },
  });
}

// 단순 라인 차트 생성 함수 (환율, 금 시세용) - 카테고리 축 사용
export function createSimpleLineChart(
  canvasId,
  label,
  minVal = 1000,
  maxVal = 1500,
) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(
      `[ChartHelper] Canvas with id ${canvasId} not found for Simple Line Chart.`,
    );
    return null;
  }
  const ctx = canvas.getContext("2d");
  const lineData = generateLineData(60, minVal, maxVal); // 60개 데이터 포인트 생성
  return new Chart(ctx, {
    type: "line",
    data: {
      // labels: lineData.map(d => d.x), // 카테고리 축, data 객체의 x값 사용
      datasets: [
        {
          label: label,
          data: lineData, // 객체 배열 형태 {x: label, y: value}
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
          type: "category", // x축 타입을 'category'로 명시
          // labels: lineData.map(d => d.x),
          ticks: {
            font: { family: "NeoDunggeunmoPro-Regular", size: 10 },
            color: "var(--text-secondary)",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 7,
          },
          grid: { display: false },
        },
        y: {
          beginAtZero: false,
          ticks: {
            font: { family: "NeoDunggeunmoPro-Regular" },
            color: "var(--text-secondary)",
            callback: (value) => `${value.toLocaleString()}`,
          },
          grid: { color: "var(--border-color-soft)" },
        },
      },
      plugins: {
        legend: {
          display: true, // 범례 표시
          position: "top",
          labels: {
            font: { family: "NeoDunggeunmoPro-Regular" },
            color: "var(--text-secondary)",
          },
        },
        tooltip: {
          enabled: true,
          titleFont: { family: "NeoDunggeunmoPro-Regular" },
          bodyFont: { family: "NeoDunggeunmoPro-Regular" },
        },
      },
    },
  });
}

// 여기에 1D/1W/1M 차트용 함수들은 포함되지 않습니다 (요청에 따라 새 코드로 대체).
// createHourlyLineChart, createDailyLineChart 및 fetch 함수들은 제거됩니다.
