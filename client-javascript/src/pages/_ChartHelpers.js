// src/pages/_ChartHelpers.js
import "chartjs-adapter-date-fns";
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
      `calculateMA: Not enough data. Need ${period}, got ${
        ohlcData ? ohlcData.length : 0
      }`
    );
    return maData;
  }

  for (let i = period - 1; i < ohlcData.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      if (typeof ohlcData[i - j].c === "undefined") {
        console.error(
          "calculateMA: ohlcData item is missing 'c' property.",
          ohlcData[i - j]
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
export function createBtcPriceChart(canvasId, ohlcvData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(
      `[ChartHelper] Canvas with id ${canvasId} not found for BTC Price Chart.`
    );
    return null;
  }
  const ctx = canvas.getContext("2d");

  // ✅ 실제 API 데이터 기반으로 종가 차트 데이터 구성
  const lineChartData = ohlcvData.map((d) => ({
    x: new Date(d.open_time), // ISO 형식 처리
    y: parseFloat(d.close_price),
  }));

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Bitcoin Price (Close)",
          data: lineChartData,
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
          type: "time", // category → time으로 변경해야 날짜 포맷 자동 인식
          time: {
            unit: "hour",
            tooltipFormat: "yyyy-MM-dd HH:mm",
            displayFormats: {
              hour: "MMM d, HH:mm",
            },
          },
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
          display: true,
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

  // MA 계산용 원본 저장
  chart._fullCandlestickDataForMA = ohlcvData;

  return chart;
}

// MA(이동평균선) 차트 생성 함수 (기술 지표 영역용)
export function createMaChart(
  canvasId,
  basePriceData,
  period = 10,
  label = `MA (${period})`
) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(
      `[ChartHelper] Canvas with id ${canvasId} not found for MA Chart.`
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
      `[ChartHelper] No valid basePriceData (missing 'c' or 'x' property, or empty) provided for MA chart on ${canvasId}. Will not render MA chart.`
    );
    // MA 차트 생성을 위한 데이터가 부적절하면 null 반환하여 차트 생성 시도 중단
    return null;
  }
  const ctx = canvas.getContext("2d");

  const maData = calculateMA(basePriceData, period);

  if (maData.length === 0) {
    console.warn(
      `[ChartHelper] Not enough data to calculate MA (${period}) for ${canvasId}. MA Data length: ${maData.length}, Base Data length: ${basePriceData.length}. MA Chart will be empty.`
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
  chartData,
  color = "steelblue"
) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas not found: ${canvasId}`);
    return null;
  }

  const ctx = canvas.getContext("2d");

  return new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: label,
          data: chartData, // ← {x: date, y: value} 배열
          borderColor: color,
          borderWidth: 2,
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "yyyy-MM-dd",
          },
          title: {
            display: true,
            text: "날짜",
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "금 1kg 가격 (KRW)",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
    },
  });
}

// export function createSimpleLineChart(
//   canvasId,
//   label,
//   minVal = 1000,
//   maxVal = 1500
// ) {
//   const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(
//       `[ChartHelper] Canvas with id ${canvasId} not found for Simple Line Chart.`
//     );
//     return null;
//   }
//   const ctx = canvas.getContext("2d");
//   const lineData = generateLineData(60, minVal, maxVal); // 60개 데이터 포인트 생성
//   return new Chart(ctx, {
//     type: "line",
//     data: {
//       // labels: lineData.map(d => d.x), // 카테고리 축, data 객체의 x값 사용
//       datasets: [
//         {
//           label: label,
//           data: lineData, // 객체 배열 형태 {x: label, y: value}
//           borderColor: "rgb(75, 192, 192)",
//           tension: 0.1,
//           borderWidth: 2,
//           pointRadius: 1,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: {
//         x: {
//           type: "category", // x축 타입을 'category'로 명시
//           // labels: lineData.map(d => d.x),
//           ticks: {
//             font: { family: "NeoDunggeunmoPro-Regular", size: 10 },
//             color: "var(--text-secondary)",
//             maxRotation: 0,
//             autoSkip: true,
//             maxTicksLimit: 7,
//           },
//           grid: { display: false },
//         },
//         y: {
//           beginAtZero: false,
//           ticks: {
//             font: { family: "NeoDunggeunmoPro-Regular" },
//             color: "var(--text-secondary)",
//             callback: (value) => `${value.toLocaleString()}`,
//           },
//           grid: { color: "var(--border-color-soft)" },
//         },
//       },
//       plugins: {
//         legend: {
//           display: true, // 범례 표시
//           position: "top",
//           labels: {
//             font: { family: "NeoDunggeunmoPro-Regular" },
//             color: "var(--text-secondary)",
//           },
//         },
//         tooltip: {
//           enabled: true,
//           titleFont: { family: "NeoDunggeunmoPro-Regular" },
//           bodyFont: { family: "NeoDunggeunmoPro-Regular" },
//         },
//       },
//     },
//   });
// }

export function createIndicatorChart(canvasId, indicatorData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`[ChartHelper] Canvas with id ${canvasId} not found.`);
    return null;
  }
  const ctx = canvas.getContext("2d");

  const labels = indicatorData.map((d) => new Date(d.open_time));

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "MA (5D)",
          data: indicatorData.map((d) => parseFloat(d.ma_5D)),
          borderColor: "blue",
          fill: false,
          tension: 0.2,
        },
        {
          label: "EMA (5D)",
          data: indicatorData.map((d) => parseFloat(d.ema_5D)),
          borderColor: "green",
          fill: false,
          tension: 0.2,
        },
        {
          label: "RSI",
          data: indicatorData.map((d) => parseFloat(d.rsi_day)),
          borderColor: "orange",
          fill: false,
          tension: 0.2,
        },
        {
          label: "MACD",
          data: indicatorData.map((d) => parseFloat(d.macd_day)),
          borderColor: "purple",
          fill: false,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            padding: 8,
            color: "#000",
          },
          // ✅ 배경 제거
          // backgroundColor는 Chart.js에서는 직접 지원하지 않음
          // wrapper div에서 배경 색이 생긴 경우라면 CSS에서 조절 필요
        },
        tooltip: {
          enabled: true,
        },
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            tooltipFormat: "yyyy-MM-dd",
          },
          grid: {
            // ✅ X축 그리드 라인 제거
            display: false,
            drawBorder: false,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            // ✅ Y축 그리드 라인 제거 (필요 시)
            drawBorder: false,
            color: "#e0e0e0", // 또는 false로 완전 제거 가능
          },
        },
      },
    },
  });

  return chart;
}

// 여기에 1D/1W/1M 차트용 함수들은 포함되지 않습니다 (요청에 따라 새 코드로 대체).
// createHourlyLineChart, createDailyLineChart 및 fetch 함수들은 제거됩니다.
