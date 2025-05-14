// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"components/store.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTheme = applyTheme;
exports.setupNavbar = setupNavbar;
exports.toggleTheme = toggleTheme;
// components/store.js

// 테마 설정을 가져오는 헬퍼 함수
var getThemePreference = function getThemePreference() {
  return localStorage.getItem("theme") === "dark";
};

// 테마 아이콘을 업데이트하는 함수 (수정됨: localStorage에서 직접 테마 상태 확인)
function updateThemeIcon() {
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    var isDark = getThemePreference(); // 현재 테마 설정을 가져옴
    themeToggle.textContent = isDark ? "☀️" : "🌙"; // 아이콘 설정
  }
}

// 테마를 토글하는 함수 (수정됨)
function toggleTheme() {
  var body = document.body;
  // 현재 상태를 기준으로 다음 상태 결정
  var newIsDark = !body.classList.contains("dark-mode");
  body.classList.toggle("dark-mode", newIsDark); // body 클래스 명시적으로 설정
  localStorage.setItem("theme", newIsDark ? "dark" : "light"); // localStorage 업데이트

  // 다른 컴포넌트 알림용 커스텀 이벤트 (필요한 경우 detail에 상태 전달)
  var themeChangeEvent = new CustomEvent("themeUpdate", {
    bubbles: true,
    composed: true,
    detail: {
      isDark: newIsDark
    }
  });
  document.dispatchEvent(themeChangeEvent);
  updateThemeIcon(); // 아이콘 즉시 업데이트
}

// 페이지 로드 또는 변경 시 테마를 적용하는 함수
function applyTheme() {
  var isDarkMode = getThemePreference();
  document.body.classList.toggle("dark-mode", isDarkMode);
  updateThemeIcon(); // 테마 적용 시 아이콘도 업데이트
}

// 네비게이션 바 설정 함수
function setupNavbar() {
  var navbar = document.createElement("nav");
  navbar.className = "navbar";
  var container = document.createElement("div");
  container.className = "container";

  // 로고
  var logo = document.createElement("div");
  logo.className = "logo";
  logo.textContent = "⛅ 매수하기 딱 좋은 날씨네!?";
  logo.addEventListener("click", function () {
    return window.location.hash = "";
  });

  // 네비게이션 링크
  var navLinks = document.createElement("div");
  navLinks.className = "nav-links";
  ["메인", "수익률 예측", "종목토론"].forEach(function (text, index) {
    var a = document.createElement("a");
    a.textContent = text;
    a.href = "#".concat(["main", "prediction", "discussion"][index]);
    navLinks.appendChild(a);
  });

  // 검색 및 로그인 영역
  var searchBox = document.createElement("div");
  searchBox.className = "search-login";
  var searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "검색...";
  var searchActionBtn = document.createElement("button");
  searchActionBtn.textContent = "검색";
  var themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.addEventListener("click", toggleTheme);
  var loginBtn = document.createElement("button");
  loginBtn.textContent = "로그인";
  loginBtn.id = "navbar-login-button";
  // ✅ 로그인 버튼 클릭 시 #/login 으로 이동
  loginBtn.addEventListener("click", function () {
    window.location.hash = "#/login";
  });
  searchBox.append(searchInput, searchActionBtn, themeToggle, loginBtn);
  container.append(logo, navLinks, searchBox);
  navbar.appendChild(container);
  document.body.insertBefore(navbar, document.body.firstChild);
  applyTheme();
}
},{}],"app/api/conapi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COIN_LIST = void 0;
exports.getFearGreedEmoji = getFearGreedEmoji;
exports.getFearGreedIndex = getFearGreedIndex;
exports.getFearGreedLabel = getFearGreedLabel;
exports.getMarketCapHistory = getMarketCapHistory;
exports.getTechnicalIndicators = getTechnicalIndicators;
exports.getWeatherPrediction = getWeatherPrediction;
// app/api/conapi.js

var COIN_LIST = exports.COIN_LIST = [{
  rank: 1,
  name: "비트코인",
  symbol: "BTC",
  graphicSymbol: "₿",
  // 비트코인 그래픽 심볼
  apiSymbol: "BTCUSDT",
  price: "$67,890.45",
  change: "+2.34%"
}, {
  rank: 2,
  name: "이더리움",
  symbol: "ETH",
  graphicSymbol: "Ξ",
  // 이더리움 그래픽 심볼
  apiSymbol: "ETHUSDT",
  price: "$3,456.78",
  change: "+1.23%"
}, {
  rank: 3,
  name: "리플",
  symbol: "XRP",
  graphicSymbol: "✕",
  // 리플 그래픽 심볼 (일반적으로 사용되는 X)
  apiSymbol: "XRPUSDT",
  price: "$1.23",
  change: "-0.45%"
}, {
  rank: 4,
  name: "바이낸스코인",
  symbol: "BNB",
  graphicSymbol: "BNB",
  // 그래픽 심볼 없는 경우 텍스트 심볼 사용
  apiSymbol: "BNBUSDT",
  price: "$456.78",
  change: "+0.89%"
}, {
  rank: 5,
  name: "솔라나",
  symbol: "SOL",
  graphicSymbol: "SOL",
  // 그래픽 심볼 없는 경우 텍스트 심볼 사용
  apiSymbol: "SOLUSDT",
  price: "$123.45",
  change: "+5.67%"
}, {
  rank: 6,
  name: "도지코인",
  symbol: "DOGE",
  graphicSymbol: "Ɖ",
  // 도지코인 그래픽 심볼
  apiSymbol: "DOGEUSDT",
  price: "$0.123",
  change: "-1.23%"
}, {
  rank: 7,
  name: "카르다노",
  symbol: "ADA",
  graphicSymbol: "₳",
  // 카르다노 그래픽 심볼
  apiSymbol: "ADAUSDT",
  price: "$0.456",
  change: "+0.78%"
}, {
  rank: 8,
  name: "트론",
  symbol: "TRX",
  graphicSymbol: "TRX",
  // 그래픽 심볼 없는 경우 텍스트 심볼 사용
  apiSymbol: "TRXUSDT",
  price: "$0.089",
  change: "-0.34%"
}, {
  rank: 9,
  name: "시바이누",
  symbol: "SHIB",
  graphicSymbol: "SHIB",
  // 그래픽 심볼 없는 경우 텍스트 심볼 사용
  apiSymbol: "SHIBUSDT",
  price: "$0.00002345",
  change: "+3.45%"
}, {
  rank: 10,
  name: "라이트코인",
  symbol: "LTC",
  graphicSymbol: "Ł",
  // 라이트코인 그래픽 심볼
  apiSymbol: "LTCUSDT",
  price: "$78.90",
  change: "-0.67%"
}];

// 랜덤으로 기술지표 점수 반환 (실제로는 계산 또는 API 호출 필요)
function getTechnicalIndicators(symbol) {
  // console.log(`Fetching technical indicators for ${symbol}...`); // 실제 API 호출 시 유용
  return {
    ma: Math.random() * 100,
    ema: Math.random() * 100,
    rsi: Math.random() * 100,
    macd: (Math.random() * 2 - 1) * 10
  };
}

// 가상의 날씨예측: 점수에 따라 아이콘 결정 (3일치 예보 반환)
function getWeatherPrediction(symbol) {
  // console.log(`Fetching weather prediction for ${symbol}...`); // 실제 API 호출 시 유용
  var weathers = [{
    icon: "🔆",
    label: "맑음",
    description: "강세 예상"
  }, {
    icon: "⛅️",
    label: "구름조금",
    description: "약세장 예상"
  }, {
    icon: "☁️",
    label: "흐림",
    description: "관망세 예상"
  }, {
    icon: "🌧️",
    label: "비",
    description: "하락세 예상"
  }, {
    icon: "⛈️",
    label: "폭풍",
    description: "급락세 예상"
  }, {
    icon: "❄️",
    label: "눈",
    description: "변동성 확대"
  }, {
    icon: "💨",
    label: "바람",
    description: "시장 불안정"
  }];
  var dailyForecasts = ["yesterday", "today", "tomorrow"].map(function (dayType) {
    var idx = Math.floor(Math.random() * weathers.length);
    var weather = weathers[idx];
    return {
      day: dayType,
      icon: weather.icon,
      label: weather.label,
      description: weather.description,
      tooltip: "".concat(symbol, " ").concat(dayType === "today" ? "오늘" : dayType === "yesterday" ? "어제" : "내일", " \uC608\uC0C1: ").concat(weather.description)
    };
  });
  return dailyForecasts;
}

// 가상의 시가총액 차트용 데이터 (7일치 랜덤 데이터 생성)
function getMarketCapHistory(symbol) {
  // console.log(`Fetching market cap history for ${symbol}...`); // 실제 API 호출 시 유용
  var labels = [];
  var data = [];
  for (var i = 6; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    labels.push("".concat(d.getMonth() + 1, "/").concat(d.getDate()));
    // 심볼별로 약간 다른 패턴을 주도록 랜덤 값 범위 조정 (예시)
    var baseValue = 100;
    if (symbol === "BTC") baseValue = 500;else if (symbol === "ETH") baseValue = 300;
    data.push(baseValue + Math.random() * (baseValue / 2));
  }
  return {
    labels: labels,
    data: data
  };
}

// 가상의 공포/탐욕 지수 (0 ~ 100 사이의 랜덤 정수)
function getFearGreedIndex() {
  return Math.floor(Math.random() * 101);
}

// 공포/탐욕 지수 값에 따른 레이블 반환
function getFearGreedLabel(value) {
  if (value < 20) return "극단적 공포";
  if (value < 40) return "공포";
  if (value < 60) return "중립";
  if (value < 80) return "탐욕";
  return "극단적 탐욕";
}

// 공포/탐욕 지수 값에 따른 이모티콘 반환
function getFearGreedEmoji(value) {
  if (value < 20) return "😱";
  if (value < 40) return "😨";
  if (value < 60) return "😐";
  if (value < 80) return "😊";
  return "🤩"; // output5.txt 에서는 "🤩" 로 되어있음. (이전 답변은 "🤑" 이었음)
}

// 추가: 실제 CoinAPI 연동을 위한 예시 함수 (주석 처리됨, API 키 필요)
/*
const COINAPI_KEY = "YOUR_API_KEY"; // 실제 API 키로 교체해야 합니다.
const BASE_URL = "https://rest.coinapi.io/v1";

export async function fetchCoinPrice(symbol = "BTC", convertTo = "USD") {
  if (!COINAPI_KEY || COINAPI_KEY === "YOUR_API_KEY") {
    console.warn("CoinAPI key is not set. Returning mock data.");
    return Math.random() * 70000; // 목업 데이터 반환
  }
  try {
    const response = await fetch(`${BASE_URL}/exchangerate/${symbol}/${convertTo}`, {
      headers: {
        'X-CoinAPI-Key': COINAPI_KEY,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`CoinAPI Error: ${response.status} - ${errorData.message || 'Failed to fetch price'}`);
    }
    const data = await response.json();
    return data.rate;
  } catch (error) {
    console.error('Error fetching data from CoinAPI:', error);
    throw error; // 에러를 다시 던져서 호출한 쪽에서 처리하도록 함
  }
}

export async function fetchHistoricalData(symbol = "BTCUSDT", periodId = "1DAY", timeStart, timeEnd) {
  if (!COINAPI_KEY || COINAPI_KEY === "YOUR_API_KEY") {
    console.warn("CoinAPI key is not set. Returning mock historical data.");
    return getMarketCapHistory(symbol.replace('USDT', '')).data.map((val, index) => ({
        time_period_start: new Date(new Date().setDate(new Date().getDate() - (6 - index))).toISOString(),
        price_close: val
    })); // 목업 데이터 반환
  }
  const startDate = timeStart || new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0] + "T00:00:00";
  const endDate = timeEnd || new Date().toISOString().split('T')[0] + "T23:59:59";
  
  try {
    const response = await fetch(
      `${BASE_URL}/ohlcv/${symbol.startsWith('X:') ? symbol : 'BITSTAMP_SPOT_' + symbol.replace('USDT', '_USD')}/history?period_id=${periodId}&time_start=${startDate}&time_end=${endDate}`,
      {
        headers: {
          'X-CoinAPI-Key': COINAPI_KEY,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`CoinAPI Error: ${response.status} - ${errorData.message || 'Failed to fetch historical data'}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data from CoinAPI:', error);
    throw error;
  }
}
*/
},{}],"pages/MainPage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderMainPage = renderMainPage;
var _conapi = require("../app/api/conapi.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// createMarketCapChart 함수는 이전과 동일하게 유지
function createMarketCapChart() {
  var chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chart.setAttribute("class", "market-cap-chart");
  chart.setAttribute("viewBox", "0 0 100 60");
  var _getMarketCapHistory = (0, _conapi.getMarketCapHistory)(),
    data = _getMarketCapHistory.data; // COIN_LIST[0].symbol 인자 제거 (getMarketCapHistory는 인자 안 받음)
  var points = data.map(function (val, i) {
    return "".concat(i * (100 / (data.length - 1)), ",").concat(60 - val / Math.max.apply(Math, _toConsumableArray(data)) * 50);
  }).join(" ");
  var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "#ff3b30"); // 기본 라이트모드 색상, 다크모드는 CSS에서 처리
  polyline.setAttribute("stroke-width", "1");
  chart.appendChild(polyline);
  return chart;
}
function renderMainPage(container) {
  container.innerHTML = "";
  var main = document.createElement("div");
  main.className = "main-content";

  // 좌측 패널 (코인 일기예보)
  var left = document.createElement("div");
  left.className = "left-panel";
  var leftTitle = document.createElement("h3");
  leftTitle.textContent = "코인 일기예보";
  left.appendChild(leftTitle);
  var coinListContainer = document.createElement("div");
  coinListContainer.className = "coin-list-container";
  _conapi.COIN_LIST.forEach(function (coin) {
    var coinItem = document.createElement("div");
    coinItem.className = "coin-item";
    coinItem.style.cursor = "pointer";
    coinItem.addEventListener("click", function () {
      window.location.hash = "coin/".concat(coin.symbol);
    });

    // 코인 기본 정보 (심볼, 이름, 가격, 변동률)
    var coinInfoRow = document.createElement("div");
    coinInfoRow.className = "coin-info-row";
    var coinSymbolName = document.createElement("div");
    coinSymbolName.className = "coin-symbol-name";
    var symbolDisplay = document.createElement("span");
    symbolDisplay.className = "coin-item-symbol";
    // 수정된 부분: 그래픽 심볼 우선 표시
    symbolDisplay.textContent = coin.graphicSymbol || coin.symbol;
    var nameDisplay = document.createElement("span");
    nameDisplay.className = "coin-item-name";
    nameDisplay.textContent = " ".concat(coin.name); // 심볼과 이름 사이 공백 추가

    coinSymbolName.appendChild(symbolDisplay);
    coinSymbolName.appendChild(nameDisplay);
    var price = document.createElement("div");
    price.className = "coin-price";
    price.textContent = coin.price;
    var change = document.createElement("div");
    change.className = "coin-change";
    change.textContent = coin.change || "0%";
    change.style.color = coin.change && coin.change.includes("+") ? "#34c759" : "#ff3b30";
    coinInfoRow.appendChild(coinSymbolName);
    coinInfoRow.appendChild(price);
    coinInfoRow.appendChild(change);
    coinItem.appendChild(coinInfoRow);

    // 어제, 오늘, 내일 날씨 정보
    var dailyWeatherRow = document.createElement("div");
    dailyWeatherRow.className = "daily-weather-row";
    var forecasts = (0, _conapi.getWeatherPrediction)(coin.symbol);
    forecasts.forEach(function (forecast) {
      var weatherDayBlock = document.createElement("div");
      weatherDayBlock.className = "weather-day-block";
      var dayLabel = document.createElement("div");
      dayLabel.className = "weather-day-label";
      if (forecast.day === "yesterday") dayLabel.textContent = "어제";else if (forecast.day === "today") dayLabel.textContent = "오늘";else if (forecast.day === "tomorrow") dayLabel.textContent = "내일";
      var weatherIcon = document.createElement("span");
      weatherIcon.className = "weather-day-icon";
      weatherIcon.textContent = forecast.icon;
      weatherIcon.title = forecast.tooltip;
      weatherDayBlock.appendChild(dayLabel);
      weatherDayBlock.appendChild(weatherIcon);
      dailyWeatherRow.appendChild(weatherDayBlock);
    });
    coinItem.appendChild(dailyWeatherRow);
    coinListContainer.appendChild(coinItem);
  });
  left.appendChild(coinListContainer);

  // ... (이하 코드는 이전과 거의 동일) ...
  var analysisNote = document.createElement("div");
  analysisNote.className = "analysis-note";
  analysisNote.textContent = "* 날씨 아이콘은 각 날짜의 예상 변동성을 나타냅니다.";
  left.appendChild(analysisNote);
  var ctaButtons = document.createElement("div");
  ctaButtons.className = "cta-buttons";
  var predictBtn = document.createElement("button");
  predictBtn.textContent = "예측하기";
  predictBtn.onclick = function () {
    return window.location.hash = "prediction";
  };
  var discussBtn = document.createElement("button");
  discussBtn.textContent = "토론방";
  discussBtn.onclick = function () {
    return window.location.hash = "discussion";
  };
  ctaButtons.appendChild(predictBtn);
  ctaButtons.appendChild(discussBtn);
  left.appendChild(ctaButtons);

  // 우측 패널
  var right = document.createElement("div");
  right.className = "right-panel";

  // 시가 총액 패널
  var marketCapPanel = document.createElement("div");
  marketCapPanel.className = "market-cap-panel";
  var marketCapHeader = document.createElement("div");
  marketCapHeader.className = "market-cap-header";
  var marketCapTitle = document.createElement("div");
  marketCapTitle.textContent = "시가 총액";
  marketCapTitle.className = "market-cap-title";
  var marketCapValueContainer = document.createElement("div");
  marketCapValueContainer.className = "market-cap-value-container";
  var marketCapValue = document.createElement("div");
  marketCapValue.textContent = "₩4.04P"; // 이 값은 동적으로 변경될 수 있어야 함
  marketCapValue.className = "market-cap-value";
  var marketCapChange = document.createElement("div");
  marketCapChange.textContent = "▼ 0.86%"; // 이 값은 동적으로 변경될 수 있어야 함
  marketCapChange.className = "market-cap-change";
  marketCapValueContainer.appendChild(marketCapValue);
  marketCapValueContainer.appendChild(marketCapChange);
  marketCapHeader.appendChild(marketCapTitle);
  marketCapHeader.appendChild(marketCapValueContainer);
  var marketCapChartSVG = createMarketCapChart();
  marketCapPanel.appendChild(marketCapHeader);
  marketCapPanel.appendChild(marketCapChartSVG);

  // 공포 탐욕 지수 패널
  var fearGreedPanel = document.createElement("div");
  fearGreedPanel.className = "fear-greed-panel";
  var fearGreedHeader = document.createElement("div");
  fearGreedHeader.className = "fear-greed-header";
  var fearGreedTitle = document.createElement("div");
  fearGreedTitle.textContent = "공포와 탐욕";
  fearGreedTitle.className = "fear-greed-title";
  var fearGreedIndex = (0, _conapi.getFearGreedIndex)();
  var fgValueAndStatusContainer = document.createElement("div");
  fgValueAndStatusContainer.className = "fear-greed-current-value-status";
  var fearGreedValueSmall = document.createElement("div");
  fearGreedValueSmall.textContent = fearGreedIndex;
  fearGreedValueSmall.className = "fear-greed-value-small";
  var fearGreedStatusTextSmall = document.createElement("div");
  fearGreedStatusTextSmall.textContent = (0, _conapi.getFearGreedLabel)(fearGreedIndex);
  fearGreedStatusTextSmall.className = "fear-greed-status-small";
  fgValueAndStatusContainer.appendChild(fearGreedValueSmall);
  fgValueAndStatusContainer.appendChild(fearGreedStatusTextSmall);
  fearGreedHeader.appendChild(fearGreedTitle);
  fearGreedHeader.appendChild(fgValueAndStatusContainer);
  fearGreedPanel.appendChild(fearGreedHeader);
  var fearGreedContent = document.createElement("div");
  fearGreedContent.className = "fear-greed-content";
  var fearGreedInfo = document.createElement("div");
  fearGreedInfo.className = "fear-greed-info";
  var emojiDisplay = document.createElement("div");
  emojiDisplay.className = "fear-greed-emoji-display";
  emojiDisplay.textContent = (0, _conapi.getFearGreedEmoji)(fearGreedIndex);
  var fearGreedValueDisplay = document.createElement("div");
  fearGreedValueDisplay.className = "fear-greed-value-display";
  fearGreedValueDisplay.textContent = fearGreedIndex;
  var statusDisplayText = document.createElement("div");
  statusDisplayText.className = "fear-greed-status-display-text";
  statusDisplayText.textContent = (0, _conapi.getFearGreedLabel)(fearGreedIndex);
  fearGreedInfo.appendChild(emojiDisplay);
  fearGreedInfo.appendChild(fearGreedValueDisplay);
  fearGreedInfo.appendChild(statusDisplayText);
  var fearGreedGraph = document.createElement("div");
  fearGreedGraph.className = "fear-greed-graph";
  var gauge = document.createElement("div");
  gauge.className = "fear-greed-gauge";
  var indicator = document.createElement("div");
  indicator.className = "fear-greed-indicator";
  indicator.style.left = "".concat(fearGreedIndex, "%");
  gauge.appendChild(indicator);
  var labels = document.createElement("div");
  labels.className = "fear-greed-labels";
  var fearLabel = document.createElement("span");
  fearLabel.textContent = "😨 극도의 공포"; // 이전 답변의 😱에서 변경됨 (conapi.js 기준)
  var neutralLabel = document.createElement("span");
  neutralLabel.textContent = "😐 중립";
  var greedLabel = document.createElement("span");
  greedLabel.textContent = "🤩 극도의 탐욕"; // 이전 답변의 🤑에서 변경됨 (conapi.js 기준)
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
},{"../app/api/conapi.js":"app/api/conapi.js"}],"pages/_ChartHelpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBtcPriceChart = createBtcPriceChart;
exports.createMaChart = createMaChart;
exports.createSimpleLineChart = createSimpleLineChart;
// pages/_ChartHelpers.js

// 임시 캔들스틱 데이터 생성 (날짜, 시, 고, 저, 종) - 카테고리 축용
function generateCandlestickData() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;
  var data = [];
  var date = new Date();
  date.setDate(date.getDate() - count);
  var lastClose = 50000 + Math.random() * 10000;
  for (var i = 0; i < count; i++) {
    var open = lastClose + (Math.random() - 0.5) * 1000;
    var close = open + (Math.random() - 0.5) * 2000;
    var high = Math.max(open, close) + Math.random() * 500;
    var low = Math.min(open, close) - Math.random() * 500;
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateLabel = "".concat(month, "/").concat(day);
    data.push({
      x: dateLabel,
      o: open,
      h: high,
      l: low,
      c: close
    });
    lastClose = close;
    date.setDate(date.getDate() + 1);
  }
  return data;
}

// 임시 MA 데이터 생성 (캔들스틱 데이터 기반) - 카테고리 축용
function calculateMA(ohlcData) {
  var period = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var maData = [];
  if (!ohlcData || ohlcData.length < period) return maData;
  for (var i = period - 1; i < ohlcData.length; i++) {
    var sum = 0;
    for (var j = 0; j < period; j++) {
      // ohlcData의 각 요소에 'c'(종가) 속성이 있어야 함
      if (typeof ohlcData[i - j].c === 'undefined') {
        console.error("calculateMA: ohlcData item is missing 'c' property.", ohlcData[i - j]);
        return []; // 에러 발생 시 빈 배열 반환
      }
      sum += ohlcData[i - j].c;
    }
    maData.push({
      x: ohlcData[i].x,
      // 동일한 x축 카테고리 사용
      y: sum / period
    });
  }
  return maData;
}

// 임시 라인 차트 데이터 생성 - 카테고리 축용 (환율, 금 시세용)
function generateLineData() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60;
  var minVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var maxVal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1500;
  var data = [];
  var date = new Date();
  date.setDate(date.getDate() - count);
  for (var i = 0; i < count; i++) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dateLabel = "".concat(month, "/").concat(day);
    data.push({
      x: dateLabel,
      y: Math.random() * (maxVal - minVal) + minVal
    });
    date.setDate(date.getDate() + 1);
  }
  return data;
}

// 비트코인 가격 차트 (라인 차트로 변경) 생성 함수 - 카테고리 축 사용
function createBtcPriceChart(canvasId) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("Canvas with id ".concat(canvasId, " not found for BTC Price Chart."));
    return null;
  }
  var ctx = canvas.getContext("2d");

  // MA 계산을 위해 전체 OHLC 데이터 생성
  var candlestickRawData = generateCandlestickData(60);
  // 라인 차트를 위해 종가(c)만 활용
  var lineChartData = candlestickRawData.map(function (d) {
    return {
      x: d.x,
      y: d.c
    };
  });
  var chart = new Chart(ctx, {
    type: "line",
    // 차트 타입을 'line'으로 변경
    data: {
      datasets: [{
        label: "Bitcoin Price (Close)",
        // 라벨 변경
        data: lineChartData,
        // 가공된 라인 차트 데이터 사용
        borderColor: "rgb(54, 162, 235)",
        // 라인 색상 예시
        tension: 0.1,
        // 라인 곡률
        borderWidth: 2,
        // 라인 두께
        pointRadius: 1 // 데이터 포인트 크기
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category"
        },
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
  // MA 차트 생성 시 원본 OHLC 데이터를 사용하기 위해 차트 객체에 저장
  chart._fullCandlestickDataForMA = candlestickRawData;
  return chart;
}

// MA(이동평균선) 차트 생성 함수 (기술 지표 영역용)
function createMaChart(canvasId, basePriceData) {
  var period = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "MA (".concat(period, ")");
  var canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("Canvas with id ".concat(canvasId, " not found for MA Chart."));
    return null;
  }
  // basePriceData는 OHLC 형태여야 하며, 각 요소는 'x'와 'c' 속성을 가져야 함
  if (!basePriceData || basePriceData.length === 0 || typeof basePriceData[0].c === 'undefined' || typeof basePriceData[0].x === 'undefined') {
    console.warn("No valid basePriceData (missing 'c' or 'x' property, or empty) provided for MA chart on ".concat(canvasId));
    return null;
  }
  var ctx = canvas.getContext("2d");
  var maData = calculateMA(basePriceData, period);
  if (maData.length === 0) {
    console.warn("Not enough data to calculate MA (".concat(period, ") for ").concat(canvasId, ". MA Data length: ").concat(maData.length, ", Base Data length: ").concat(basePriceData.length));
    // MA 데이터가 비어있어도 빈 차트를 그릴 수 있도록 하거나, null을 반환하여 아예 그리지 않도록 할 수 있음
    // 여기서는 빈 데이터셋으로 차트를 생성하도록 허용 (Chart.js가 빈 데이터 처리)
  }
  return new Chart(ctx, {
    type: "line",
    data: {
      datasets: [{
        label: label,
        data: maData,
        borderColor: "orange",
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category"
          // x축 레이블은 maData에 포함된 x값을 사용
        },
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
}

// 단순 라인 차트 생성 함수 (환율, 금 시세용) - 카테고리 축 사용
function createSimpleLineChart(canvasId, label, minVal, maxVal) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("Canvas with id ".concat(canvasId, " not found for Simple Line Chart."));
    return null;
  }
  var ctx = canvas.getContext("2d");
  var lineData = generateLineData(60, minVal, maxVal);
  return new Chart(ctx, {
    type: "line",
    data: {
      datasets: [{
        label: label,
        data: lineData,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category"
        },
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}
},{}],"pages/CoinDetail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCoinDetailPage = renderCoinDetailPage;
var _conapi = require("../app/api/conapi.js");
var _ChartHelpers = require("./_ChartHelpers.js");
// pages/CoinDetail.js

var activeChartObjects = {};
function destroyAllActiveCharts() {
  for (var canvasId in activeChartObjects) {
    if (activeChartObjects[canvasId] && typeof activeChartObjects[canvasId].destroy === 'function') {
      try {
        activeChartObjects[canvasId].destroy();
      } catch (e) {
        console.error("Error destroying chart ".concat(canvasId, ":"), e);
      }
    }
  }
  activeChartObjects = {};
}
function renderCoinDetailPage(container) {
  var coinSymbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "BTC";
  destroyAllActiveCharts();
  container.innerHTML = "";
  var coin = _conapi.COIN_LIST.find(function (c) {
    return c.symbol === coinSymbol;
  }) || _conapi.COIN_LIST[0];
  var pageWrapper = document.createElement("div");
  pageWrapper.className = "coin-detail-page-wrapper";

  // --- 왼쪽 고정 정보 패널 ---
  var stickyLeftPanel = document.createElement("div");
  stickyLeftPanel.className = "coin-detail-sticky-left-panel";
  var header = document.createElement("div");
  header.className = "coin-detail-header";
  var title = document.createElement("h2");
  var displaySymbol = coin.graphicSymbol || coin.symbol;
  title.innerHTML = "<span class=\"coin-graphic-symbol-detail\">".concat(displaySymbol, "</span> ").concat(coin.name, " (").concat(coin.symbol, ")");
  var price = document.createElement("div");
  price.className = "coin-detail-price";
  price.textContent = "\uD604\uC7AC\uAC00: ".concat(coin.price || "₩90,000,000");
  header.appendChild(title);
  header.appendChild(price);
  var weatherInfo = document.createElement("div");
  weatherInfo.className = "weather-forecast";
  var forecasts = (0, _conapi.getWeatherPrediction)(coin.symbol);
  forecasts.forEach(function (forecast) {
    var dayForecast = document.createElement("div");
    dayForecast.className = "day-forecast";
    var dayLabelText = "";
    if (forecast.day === "yesterday") dayLabelText = "어제";else if (forecast.day === "today") dayLabelText = "오늘";else if (forecast.day === "tomorrow") dayLabelText = "내일";
    dayForecast.textContent = "".concat(dayLabelText, " ").concat(forecast.icon);
    weatherInfo.appendChild(dayForecast);
  });
  var indicators = (0, _conapi.getTechnicalIndicators)(coin.symbol);
  var technicalInfo = document.createElement("div");
  technicalInfo.className = "technical-indicators";
  technicalInfo.textContent = "MA: ".concat(Math.round(indicators.ma), " / EMA: ").concat(Math.round(indicators.ema), " / RSI: ").concat(Math.round(indicators.rsi), " / MACD: ").concat(Math.round(indicators.macd));
  var returns = document.createElement("div");
  returns.className = "returns-info";
  var timeframes = ["24시간", "7일", "30일"];
  var values = ["+2.2%", "+5.0%", "+10.0%"];
  timeframes.forEach(function (time, index) {
    var returnItem = document.createElement("div");
    returnItem.className = "return-item";
    returnItem.textContent = "".concat(time, ": ").concat(values[index]);
    returns.appendChild(returnItem);
  });

  // 요청 1: returns-info 아래에 추가 영역 확보
  var tempInfoPlaceholder = document.createElement("div");
  tempInfoPlaceholder.className = "temp-info-placeholder";
  tempInfoPlaceholder.innerHTML = "\n    <h4>\uC784\uC2DC \uC815\uBCF4 \uC601\uC5ED</h4>\n    <p>\uC5EC\uAE30\uC5D0 \uCD94\uAC00\uC801\uC778 \uC815\uBCF4\uB098 \uCEF4\uD3EC\uB10C\uD2B8\uAC00 \uD45C\uC2DC\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>\n    <ul>\n      <li>\uD56D\uBAA9 1</li>\n      <li>\uD56D\uBAA9 2</li>\n    </ul>\n  ";

  // 요청 1: 수익률 예측과, 토론방 이동 버튼을 아래로 이동.
  var buttonArea = document.createElement("div");
  buttonArea.className = "coin-detail-buttons";
  var predictButton = document.createElement("button");
  predictButton.textContent = "수익률 예측";
  predictButton.onclick = function () {
    return window.location.hash = "#prediction/".concat(coin.symbol);
  };
  var discussButton = document.createElement("button");
  discussButton.textContent = "토론방 이동";
  discussButton.onclick = function () {
    return window.location.hash = "#discussion/".concat(coin.symbol);
  };
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
  var rightContentArea = document.createElement("div");
  rightContentArea.className = "coin-detail-right-content-area";

  // 1. 첫 번째 컬럼: 코인 가격 차트 (MA 제외)
  var coinChartColumn = document.createElement("div");
  coinChartColumn.className = "coin-chart-column";
  var priceAndIndicatorCombinedChartArea = document.createElement("div");
  priceAndIndicatorCombinedChartArea.className = "combined-chart-area-moved";
  var priceChartContainer = document.createElement("div");
  priceChartContainer.className = "price-chart-container";
  var priceChartHeaderEl = document.createElement("div");
  priceChartHeaderEl.className = "chart-header";
  priceChartHeaderEl.innerHTML = "<h3><span class=\"coin-graphic-symbol-detail\">".concat(displaySymbol, "</span> ").concat(coin.name, " \uAC00\uACA9 \uBCC0\uB3D9</h3>");
  var priceChartOptions = document.createElement("div");
  priceChartOptions.className = "chart-options";
  // 초기에는 '라인' 차트를 선택된 것으로 표시 (현재 라인차트 기본)
  ["캔들", "라인"].forEach(function (type) {
    var option = document.createElement("button");
    option.className = type === "라인" ? "chart-option selected" : "chart-option";
    option.textContent = type;
    // TODO: 캔들/라인 차트 전환 로직 추가 필요
    priceChartOptions.appendChild(option);
  });
  ["1일", "1주", "1개월", "1년", "전체"].forEach(function (time) {
    var option = document.createElement("button");
    option.className = time === "1개월" ? "time-option selected" : "time-option";
    option.textContent = time;
    priceChartOptions.appendChild(option);
  });
  var priceCanvasWrapper = document.createElement("div");
  priceCanvasWrapper.className = "canvas-wrapper";
  var priceChartCanvas = document.createElement("canvas");
  priceChartCanvas.id = "btcPriceChartCanvas";
  priceCanvasWrapper.appendChild(priceChartCanvas);
  priceChartContainer.appendChild(priceChartHeaderEl);
  priceChartContainer.appendChild(priceChartOptions);
  priceChartContainer.appendChild(priceCanvasWrapper);

  // 기술 지표 차트 부분 (MA 차트 표시)
  var indicatorChartContainer = document.createElement("div");
  indicatorChartContainer.className = "indicator-chart-container";
  var indicatorChartHeaderEl = document.createElement("h4");
  indicatorChartHeaderEl.textContent = "기술 지표";
  var indicatorsTabs = document.createElement("div");
  indicatorsTabs.className = "indicators-tabs";
  var indicatorTypes = ["MA", "EMA", "RSI", "MACD"];
  indicatorTypes.forEach(function (indType) {
    var tab = document.createElement("button");
    tab.className = indType === "MA" ? "indicator-tab selected" : "indicator-tab";
    tab.textContent = indType;
    tab.addEventListener('click', function () {
      indicatorsTabs.querySelectorAll('.indicator-tab').forEach(function (t) {
        return t.classList.remove('selected');
      });
      tab.classList.add('selected');
      if (activeChartObjects['indicatorChartCanvas'] && typeof activeChartObjects['indicatorChartCanvas'].destroy === 'function') {
        activeChartObjects['indicatorChartCanvas'].destroy();
        delete activeChartObjects['indicatorChartCanvas'];
      }
      var btcPriceChart = activeChartObjects['btcPriceChartCanvas'];
      if (indType === 'MA' && btcPriceChart && btcPriceChart._fullCandlestickDataForMA) {
        var btcOhlcDataForMA = btcPriceChart._fullCandlestickDataForMA;
        activeChartObjects['indicatorChartCanvas'] = (0, _ChartHelpers.createMaChart)('indicatorChartCanvas', btcOhlcDataForMA, 10);
      } else if (btcPriceChart) {
        // 다른 지표는 _fullCandlestickDataForMA가 필요 없을 수도 있음
        console.log("".concat(indType, " chart selected, but not implemented yet. Or btcPriceChartCanvas or its data is missing for MA."));
        // 다른 지표 차트 로직 (예: createRsiChart(indicatorChartCanvas, btcPriceChart._fullCandlestickDataForMA); )
      } else {
        console.warn("BTC Price Chart is not available for indicator calculation.");
      }
    });
    indicatorsTabs.appendChild(tab);
  });
  var indicatorCanvasWrapper = document.createElement("div");
  indicatorCanvasWrapper.className = "canvas-wrapper";
  var indicatorChartCanvas = document.createElement("canvas");
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
  var otherAssetsColumn = document.createElement("div");
  otherAssetsColumn.className = "other-assets-column";
  var usdKrwChartArea = document.createElement("div");
  usdKrwChartArea.className = "usd-krw-chart-area-moved"; // 이 클래스에 높이 및 스크롤 적용
  var usdKrwChartHeaderEl = document.createElement("div");
  usdKrwChartHeaderEl.className = "chart-header";
  usdKrwChartHeaderEl.innerHTML = "<h3>USD/KRW 환율 변동</h3>";
  var usdKrwCanvasWrapper = document.createElement("div");
  usdKrwCanvasWrapper.className = "canvas-wrapper";
  var usdKrwChartCanvas = document.createElement("canvas");
  usdKrwChartCanvas.id = "usdKrwChartCanvas";
  usdKrwCanvasWrapper.appendChild(usdKrwChartCanvas);
  usdKrwChartArea.appendChild(usdKrwChartHeaderEl);
  usdKrwChartArea.appendChild(usdKrwCanvasWrapper);
  otherAssetsColumn.appendChild(usdKrwChartArea);
  var goldPriceChartArea = document.createElement("div");
  goldPriceChartArea.className = "gold-price-chart-area-moved"; // 이 클래스에 높이 및 스크롤 적용
  var goldPriceChartHeaderEl = document.createElement("div");
  goldPriceChartHeaderEl.className = "chart-header";
  goldPriceChartHeaderEl.innerHTML = "<h3>금 시세 변동</h3>";
  var goldPriceCanvasWrapper = document.createElement("div");
  goldPriceCanvasWrapper.className = "canvas-wrapper";
  var goldPriceChartCanvas = document.createElement("canvas");
  goldPriceChartCanvas.id = "goldPriceChartCanvas";
  goldPriceCanvasWrapper.appendChild(goldPriceChartCanvas);
  goldPriceChartArea.appendChild(goldPriceChartHeaderEl);
  goldPriceChartArea.appendChild(goldPriceCanvasWrapper);
  otherAssetsColumn.appendChild(goldPriceChartArea);
  rightContentArea.appendChild(otherAssetsColumn);

  // 3. 세 번째 컬럼: 뉴스 및 인기 게시글
  var newsColumnDetail = document.createElement("div");
  newsColumnDetail.className = "news-column-detail";
  var newsAndPostsStack = document.createElement("div");
  newsAndPostsStack.className = "news-posts-vertical-stack"; // 이 클래스에 높이 및 스크롤 적용
  var newsList = createNewsColumn();
  var postsList = createPostsColumn();
  newsAndPostsStack.appendChild(newsList);
  newsAndPostsStack.appendChild(postsList);
  newsColumnDetail.appendChild(newsAndPostsStack);
  rightContentArea.appendChild(newsColumnDetail);
  pageWrapper.appendChild(rightContentArea);
  container.appendChild(pageWrapper);

  // --- 차트 렌더링 호출 ---
  try {
    var btcChart = (0, _ChartHelpers.createBtcPriceChart)('btcPriceChartCanvas');
    if (btcChart) {
      activeChartObjects['btcPriceChartCanvas'] = btcChart;
      if (btcChart._fullCandlestickDataForMA) {
        activeChartObjects['indicatorChartCanvas'] = (0, _ChartHelpers.createMaChart)('indicatorChartCanvas', btcChart._fullCandlestickDataForMA, 10);
      } else {
        console.warn("Could not retrieve full OHLC data from BTC price chart for MA calculation.");
      }
    }
    activeChartObjects['usdKrwChartCanvas'] = (0, _ChartHelpers.createSimpleLineChart)('usdKrwChartCanvas', 'USD/KRW', 1200, 1400);
    activeChartObjects['goldPriceChartCanvas'] = (0, _ChartHelpers.createSimpleLineChart)('goldPriceChartCanvas', 'Gold Price (USD)', 1800, 2500);
  } catch (e) {
    console.error("Error rendering charts in CoinDetail.js:", e);
  }
}

// createNewsColumn, createPostsColumn 함수는 이전과 동일하게 유지
function createNewsColumn() {
  var newsColumnDiv = document.createElement("div");
  newsColumnDiv.className = "news-section-in-detail";
  var newsHeader = document.createElement("h3");
  newsHeader.textContent = "최신 뉴스";
  newsColumnDiv.appendChild(newsHeader);
  var newsListEl = document.createElement("ul");
  newsListEl.className = "news-list";
  var newsItems = [{
    title: "비트코인 사상 최고가 경신",
    time: "10분 전"
  }, {
    title: "ETF 승인 소식",
    time: "1시간 전"
  }, {
    title: "시장 분석 리포트",
    time: "3시간 전"
  }, {
    title: "기관 투자 증가",
    time: "5시간 전"
  }, {
    title: "규제 이슈",
    time: "1일 전"
  }];
  newsItems.forEach(function (item) {
    var newsItem = document.createElement("li");
    newsItem.className = "news-item";
    var title = document.createElement("div");
    title.className = "news-title";
    title.textContent = item.title;
    var time = document.createElement("div");
    time.className = "news-time";
    time.textContent = "(".concat(item.time, ")");
    newsItem.appendChild(title);
    newsItem.appendChild(time);
    newsListEl.appendChild(newsItem);
  });
  newsColumnDiv.appendChild(newsListEl);
  return newsColumnDiv;
}
function createPostsColumn() {
  var postsColumnDiv = document.createElement("div");
  postsColumnDiv.className = "posts-section-in-detail";
  var postsHeader = document.createElement("h3");
  postsHeader.textContent = "인기 게시글";
  postsColumnDiv.appendChild(postsHeader);
  var postsListEl = document.createElement("ul");
  postsListEl.className = "posts-list";
  var postItems = [{
    title: "BTC 전망 토론",
    time: "2시간 전"
  }, {
    title: "비트코인 과대평가?",
    time: "5시간 전"
  }, {
    title: "매매전략 공유",
    time: "1일 전"
  }];
  postItems.forEach(function (item) {
    var postItem = document.createElement("li");
    postItem.className = "post-item";
    var title = document.createElement("div");
    title.className = "post-title";
    title.textContent = item.title;
    var time = document.createElement("div");
    time.className = "post-time";
    time.textContent = "(".concat(item.time, ")");
    postItem.appendChild(title);
    postItem.appendChild(time);
    postsListEl.appendChild(postItem);
  });
  var moreLink = document.createElement("a");
  moreLink.className = "more-link";
  moreLink.textContent = "더 보기";
  var currentCoinSymbol = window.location.hash.split("/")[1] || "BTC";
  moreLink.href = "#discussion/".concat(currentCoinSymbol);
  postsColumnDiv.appendChild(postsListEl);
  postsColumnDiv.appendChild(moreLink);
  return postsColumnDiv;
}
},{"../app/api/conapi.js":"app/api/conapi.js","./_ChartHelpers.js":"pages/_ChartHelpers.js"}],"pages/InvestmentSimulation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderInvestmentSimulationPage = renderInvestmentSimulationPage;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i.return && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, catch: function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// src/pages/InvestmentSimulation.js

// 임시 API 모의 함수 (실제 구현 시 삭제 또는 주석 처리)
// 실제 프로젝트에서는 이 함수들을 공통 API 모듈 (예: ../app/api/conapi.js)로 옮기거나,
// 해당 모듈에서 import하여 사용하는 것이 좋습니다.
var fetchCoinList = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve) {
            return setTimeout(function () {
              return resolve([{
                id: 'bitcoin',
                name: 'Bitcoin (BTC)',
                symbol: 'BTC'
              }, {
                id: 'ethereum',
                name: 'Ethereum (ETH)',
                symbol: 'ETH'
              }, {
                id: 'dogecoin',
                name: 'Dogecoin (DOGE)',
                symbol: 'DOGE'
              }]);
            }, 500);
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchCoinList() {
    return _ref.apply(this, arguments);
  };
}();
var fetchHistoricalData = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(coinId, days) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve) {
            return setTimeout(function () {
              var prices = [];
              var price = Math.random() * 50000 + 10000;
              for (var i = 0; i < days; i++) {
                prices.push(price);
                price *= 1 + (Math.random() - 0.48) * 0.1; // 약간의 변동성 추가
              }
              resolve(prices.reverse()); // 최신 데이터가 마지막에 오도록
            }, 1000);
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchHistoricalData(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

// --- 페이지 상태 변수 ---
var appState = {
  coins: [],
  selectedCoinId: '',
  investmentAmount: 1000,
  investmentPeriod: 30,
  simulationResult: null,
  isLoading: false,
  error: ''
};

// --- DOM 요소 참조 변수 ---
var pageElements = {
  container: null,
  coinSelect: null,
  amountInput: null,
  periodInput: null,
  simulateButton: null,
  errorMessage: null,
  resultsArea: null
};

// --- 메타 정보 업데이트 함수 (Helmet 대체) ---
function updateMeta(title, description) {
  document.title = title;
  var metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description;
}

// --- UI 렌더링 함수 ---

// 전체 페이지 레이아웃 생성
function createPageLayout(appContainer) {
  appContainer.innerHTML = ''; // 이전 내용 지우기
  updateMeta('수익률 예측 시뮬레이션 - My Crypto Tracker', '선택한 암호화폐에 대한 투자 수익률을 예측해보세요.');
  pageElements.container = document.createElement('div');
  pageElements.container.className = 'simulation-page-container';

  // 헤더 생성
  var headerEl = document.createElement('header');
  headerEl.className = 'page-header';
  headerEl.innerHTML = "\n    <h2>\uC218\uC775\uB960 \uC608\uCE21 \uC2DC\uBBAC\uB808\uC774\uC158</h2>\n    <p>\uACFC\uAC70 \uB370\uC774\uD130\uB97C \uAE30\uBC18\uC73C\uB85C \uBBF8\uB798 \uD22C\uC790 \uC218\uC775\uB960\uC744 \uC608\uCE21\uD574 \uBCF4\uC138\uC694.</p>\n  ";
  pageElements.container.appendChild(headerEl);

  // 입력 폼 생성
  var formContainerEl = createFormElement();
  pageElements.container.appendChild(formContainerEl);

  // 오류 메시지 영역
  pageElements.errorMessage = document.createElement('p');
  pageElements.errorMessage.className = 'error-message';
  pageElements.errorMessage.style.display = 'none';
  pageElements.container.appendChild(pageElements.errorMessage);

  // 결과 표시 영역
  pageElements.resultsArea = document.createElement('div');
  pageElements.resultsArea.className = 'simulation-results-area';
  pageElements.container.appendChild(pageElements.resultsArea);
  appContainer.appendChild(pageElements.container);
}

// 입력 폼 요소 생성
function createFormElement() {
  var formContainer = document.createElement('div');
  formContainer.className = 'simulation-form-container';
  var formGrid = document.createElement('div');
  formGrid.className = 'form-grid';

  // 코인 선택
  var coinGroup = document.createElement('div');
  coinGroup.className = 'form-group';
  var coinLabel = document.createElement('label');
  coinLabel.htmlFor = 'coin-select';
  coinLabel.textContent = '코인 선택:';
  pageElements.coinSelect = document.createElement('select');
  pageElements.coinSelect.id = 'coin-select';
  pageElements.coinSelect.addEventListener('change', function (e) {
    appState.selectedCoinId = e.target.value;
  });
  coinGroup.appendChild(coinLabel);
  coinGroup.appendChild(pageElements.coinSelect);
  formGrid.appendChild(coinGroup);

  // 투자 금액
  var amountGroup = document.createElement('div');
  amountGroup.className = 'form-group';
  var amountLabel = document.createElement('label');
  amountLabel.htmlFor = 'investment-amount';
  amountLabel.textContent = '투자 금액 ($):';
  pageElements.amountInput = document.createElement('input');
  pageElements.amountInput.type = 'number';
  pageElements.amountInput.id = 'investment-amount';
  pageElements.amountInput.placeholder = '예: 1000';
  pageElements.amountInput.min = '1';
  pageElements.amountInput.addEventListener('input', function (e) {
    // 'change' 대신 'input'으로 더 즉각적인 반응
    appState.investmentAmount = parseFloat(e.target.value) || 0;
  });
  amountGroup.appendChild(amountLabel);
  amountGroup.appendChild(pageElements.amountInput);
  formGrid.appendChild(amountGroup);

  // 투자 기간
  var periodGroup = document.createElement('div');
  periodGroup.className = 'form-group';
  var periodLabel = document.createElement('label');
  periodLabel.htmlFor = 'investment-period';
  periodLabel.textContent = '투자 기간 (일):';
  pageElements.periodInput = document.createElement('input');
  pageElements.periodInput.type = 'number';
  pageElements.periodInput.id = 'investment-period';
  pageElements.periodInput.placeholder = '예: 30';
  pageElements.periodInput.min = '1';
  pageElements.periodInput.addEventListener('input', function (e) {
    // 'change' 대신 'input'
    appState.investmentPeriod = parseInt(e.target.value, 10) || 0;
  });
  periodGroup.appendChild(periodLabel);
  periodGroup.appendChild(pageElements.periodInput);
  formGrid.appendChild(periodGroup);
  formContainer.appendChild(formGrid);

  // 예측 버튼
  pageElements.simulateButton = document.createElement('button');
  pageElements.simulateButton.className = 'simulation-button';
  pageElements.simulateButton.addEventListener('click', handleSimulation);
  formContainer.appendChild(pageElements.simulateButton);
  return formContainer;
}

// 코인 선택 옵션 채우기
function populateCoinSelect() {
  if (!pageElements.coinSelect) return;
  pageElements.coinSelect.innerHTML = ''; // 기존 옵션 제거
  appState.coins.forEach(function (coin) {
    var option = document.createElement('option');
    option.value = coin.id; // API 응답의 id 사용
    option.textContent = "".concat(coin.name, " (").concat(coin.symbol, ")");
    if (coin.id === appState.selectedCoinId) {
      option.selected = true;
    }
    pageElements.coinSelect.appendChild(option);
  });
  // selectedCoinId가 유효하지 않거나 설정되지 않은 경우, 목록의 첫 번째 코인을 기본값으로 설정
  if (!appState.coins.find(function (c) {
    return c.id === appState.selectedCoinId;
  }) && appState.coins.length > 0) {
    appState.selectedCoinId = appState.coins[0].id;
    pageElements.coinSelect.value = appState.selectedCoinId;
  }
}

// 폼 입력 상태 업데이트 (활성화/비활성화, 값 설정)
function updateFormInputsState() {
  if (pageElements.coinSelect) {
    pageElements.coinSelect.disabled = appState.isLoading;
    pageElements.coinSelect.value = appState.selectedCoinId;
  }
  if (pageElements.amountInput) {
    pageElements.amountInput.value = appState.investmentAmount;
    pageElements.amountInput.disabled = appState.isLoading;
  }
  if (pageElements.periodInput) {
    pageElements.periodInput.value = appState.investmentPeriod;
    pageElements.periodInput.disabled = appState.isLoading;
  }
  if (pageElements.simulateButton) {
    pageElements.simulateButton.disabled = appState.isLoading;
    pageElements.simulateButton.innerHTML = appState.isLoading ? "<span class=\"spinner-sm\" role=\"status\" aria-hidden=\"true\"></span> \uACC4\uC0B0 \uC911..." : "예측 시작하기";
  }
}

// 오류 메시지 표시 업데이트
function updateErrorMessage() {
  if (!pageElements.errorMessage) return;
  pageElements.errorMessage.textContent = appState.error;
  pageElements.errorMessage.style.display = appState.error ? 'block' : 'none';
}

// 결과 영역 업데이트
function updateResultsArea() {
  if (!pageElements.resultsArea) return;
  pageElements.resultsArea.innerHTML = ''; // 이전 내용 지우기

  if (appState.isLoading) {
    pageElements.resultsArea.innerHTML = "\n      <div class=\"loading-indicator\">\n        <div class=\"spinner-lg\" role=\"status\"></div>\n        <p>\uB370\uC774\uD130\uB97C \uBD84\uC11D\uD558\uACE0 \uC608\uCE21\uD558\uB294 \uC911\uC785\uB2C8\uB2E4...</p>\n      </div>";
  } else if (appState.simulationResult) {
    var _appState$simulationR = appState.simulationResult,
      coinName = _appState$simulationR.coinName,
      coinSymbol = _appState$simulationR.coinSymbol,
      initialInvestment = _appState$simulationR.initialInvestment,
      finalValue = _appState$simulationR.finalValue,
      profitOrLoss = _appState$simulationR.profitOrLoss,
      returnRate = _appState$simulationR.returnRate,
      periodDays = _appState$simulationR.periodDays,
      futurePrice = _appState$simulationR.futurePrice,
      initialPrice = _appState$simulationR.initialPrice;
    var resultContainer = document.createElement('div');
    resultContainer.className = 'prediction-container';
    resultContainer.innerHTML = "\n      <h3>\uD83D\uDCC8 ".concat(coinName, " \uD22C\uC790 \uC608\uCE21 \uACB0\uACFC</h3>\n      <div class=\"result-summary\">\n        <p><strong>").concat(periodDays, "\uC77C \uD6C4 \uC608\uC0C1 \uACB0\uACFC:</strong></p>\n        <div class=\"result-grid\">\n          <div class=\"result-item\">\n            <span class=\"result-label\">\uCD08\uAE30 \uD22C\uC790\uAE08</span>\n            <span class=\"result-value\">$").concat(initialInvestment.toLocaleString(), "</span>\n          </div>\n          <div class=\"result-item\">\n            <span class=\"result-label\">\uC608\uC0C1 \uC790\uC0B0 \uAC00\uCE58</span>\n            <span class=\"result-value highlight-value\">$").concat(finalValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }), "</span>\n          </div>\n          <div class=\"result-item\">\n            <span class=\"result-label\">\uC608\uC0C1 \uC218\uC775/\uC190\uC2E4</span>\n            <span class=\"result-value ").concat(profitOrLoss >= 0 ? 'profit' : 'loss', "\">\n              $").concat(profitOrLoss.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }), "\n            </span>\n          </div>\n          <div class=\"result-item\">\n            <span class=\"result-label\">\uC608\uC0C1 \uC218\uC775\uB960</span>\n            <span class=\"result-value ").concat(returnRate >= 0 ? 'profit' : 'loss', "\">\n              ").concat(returnRate.toFixed(2), "%\n            </span>\n          </div>\n          <div class=\"result-item\">\n            <span class=\"result-label\">").concat(coinSymbol, " \uC2DC\uC791 \uC2DC\uC810 \uAC00\uACA9</span>\n            <span class=\"result-value\">$").concat(initialPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }), "</span>\n          </div>\n           <div class=\"result-item\">\n            <span class=\"result-label\">").concat(coinSymbol, " ").concat(periodDays, "\uC77C \uD6C4 \uC608\uC0C1 \uAC00\uACA9</span>\n            <span class=\"result-value\">$").concat(futurePrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }), "</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"disclaimer\">\n        <p>\uC774 \uC608\uCE21\uC740 \uACFC\uAC70 \uB370\uC774\uD130\uC640 \uB2E8\uC21C \uBCC0\uB3D9\uC131 \uBAA8\uB378\uC744 \uAE30\uBC18\uC73C\uB85C \uD55C \uCD94\uC815\uCE58\uC774\uBA70, \uC2E4\uC81C \uD22C\uC790 \uC218\uC775\uC744 \uBCF4\uC7A5\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uBAA8\uB4E0 \uD22C\uC790 \uACB0\uC815\uC740 \uBCF8\uC778\uC758 \uD310\uB2E8\uACFC \uCC45\uC784 \uD558\uC5D0 \uC774\uB8E8\uC5B4\uC838\uC57C \uD569\uB2C8\uB2E4.</p>\n      </div>");
    pageElements.resultsArea.appendChild(resultContainer);
  } else {
    // 로딩 중도 아니고, 결과도 없는 초기 상태
    pageElements.resultsArea.innerHTML = "\n      <div class=\"initial-info-container\">\n        <div class=\"initial-info-icon\">\n          <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"64px\" height=\"64px\">\n            <path d=\"M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z\"/>\n            <path d=\"M11 7h2v6h-2zm0 8h2v2h-2z\"/>\n            <path d=\"M16.293 9.293 14.5 11.086l-2.293-2.293-3.207 3.207 1.414 1.414L12.5 11.336l2.293 2.293 2.5-2.5.707.707-3.207 3.207-1.414-1.414L14.5 12.707l-2.293-2.293-1.793 1.793-1.414-1.414 3.207-3.207L14.5 9.086l1.793-1.793zM7.5 14.086l1.793-1.793 1.414 1.414-1.793 1.793-1.414-1.414z\"/>\n          </svg>\n        </div>\n        <h3>\uD22C\uC790\uB97C \uC2DC\uC791\uD558\uAE30 \uC804\uC5D0 \uC608\uCE21\uD574\uBCF4\uC138\uC694!</h3>\n        <p>\uC120\uD0DD\uD55C \uCF54\uC778, \uD22C\uC790\uAE08\uC561, \uAE30\uAC04\uC744 \uC785\uB825\uD558\uACE0 '\uC608\uCE21 \uC2DC\uC791\uD558\uAE30' \uBC84\uD2BC\uC744 \uB204\uB974\uBA74<br/>\uC608\uC0C1 \uC218\uC775\uB960\uACFC \uBBF8\uB798 \uAC00\uCE58\uB97C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p>\n        <small>\uBCF8 \uC2DC\uBBAC\uB808\uC774\uC158\uC740 \uACFC\uAC70 \uB370\uC774\uD130\uB97C \uAE30\uBC18\uC73C\uB85C \uD558\uBA70, \uC2E4\uC81C \uD22C\uC790 \uACB0\uACFC\uC640 \uB2E4\uB97C \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD22C\uC790 \uACB0\uC815\uC740 \uC2E0\uC911\uD558\uAC8C \uD558\uC2DC\uAE30 \uBC14\uB78D\uB2C8\uB2E4.</small>\n      </div>";
  }
}

// --- 이벤트 핸들러 및 로직 ---
function handleSimulation() {
  return _handleSimulation.apply(this, arguments);
} // --- 페이지 초기화 ---
function _handleSimulation() {
  _handleSimulation = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var historicalData, initialPrice, finalPrice, coin, coinSymbol, coinName, profitOrLoss, returnRate, futurePrice;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(!appState.selectedCoinId || !appState.investmentAmount || !appState.investmentPeriod)) {
            _context3.next = 4;
            break;
          }
          appState.error = '모든 필드를 입력해주세요.';
          updateErrorMessage();
          return _context3.abrupt("return");
        case 4:
          if (!(appState.investmentAmount <= 0)) {
            _context3.next = 8;
            break;
          }
          appState.error = '투자 금액은 0보다 커야 합니다.';
          updateErrorMessage();
          return _context3.abrupt("return");
        case 8:
          if (!(appState.investmentPeriod <= 0)) {
            _context3.next = 12;
            break;
          }
          appState.error = '투자 기간은 0보다 커야 합니다.';
          updateErrorMessage();
          return _context3.abrupt("return");
        case 12:
          appState.isLoading = true;
          appState.error = '';
          appState.simulationResult = null;
          updateFormInputsState();
          updateErrorMessage();
          updateResultsArea(); // 로딩 상태 표시
          _context3.prev = 18;
          _context3.next = 21;
          return fetchHistoricalData(appState.selectedCoinId, appState.investmentPeriod);
        case 21:
          historicalData = _context3.sent;
          if (!(historicalData.length < 2)) {
            _context3.next = 24;
            break;
          }
          throw new Error('수익률 계산에 충분한 데이터가 없습니다.');
        case 24:
          initialPrice = historicalData[0];
          finalPrice = historicalData[historicalData.length - 1];
          coin = appState.coins.find(function (c) {
            return c.id === appState.selectedCoinId;
          });
          coinSymbol = coin ? coin.symbol : appState.selectedCoinId.toUpperCase();
          coinName = coin ? coin.name : appState.selectedCoinId;
          profitOrLoss = appState.investmentAmount / initialPrice * finalPrice - appState.investmentAmount;
          returnRate = profitOrLoss / appState.investmentAmount * 100;
          futurePrice = finalPrice * (1 + (Math.random() - 0.45) * 0.2); // 임의 변동성
          appState.simulationResult = {
            coinName: coinName,
            coinSymbol: coinSymbol,
            initialInvestment: parseFloat(appState.investmentAmount),
            finalValue: parseFloat(appState.investmentAmount) + profitOrLoss,
            profitOrLoss: profitOrLoss,
            returnRate: returnRate,
            periodDays: parseInt(appState.investmentPeriod, 10),
            futurePrice: futurePrice,
            initialPrice: initialPrice
          };
          _context3.next = 39;
          break;
        case 35:
          _context3.prev = 35;
          _context3.t0 = _context3["catch"](18);
          appState.error = '시뮬레이션 중 오류가 발생했습니다: ' + _context3.t0.message;
          console.error(_context3.t0);
        case 39:
          _context3.prev = 39;
          appState.isLoading = false;
          updateFormInputsState();
          updateErrorMessage();
          updateResultsArea(); // 결과 또는 초기 메시지 표시
          return _context3.finish(39);
        case 45:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[18, 35, 39, 45]]);
  }));
  return _handleSimulation.apply(this, arguments);
}
function initializePage(_x3) {
  return _initializePage.apply(this, arguments);
} // --- 라우터에서 호출할 메인 함수 ---
function _initializePage() {
  _initializePage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(urlCoinSymbolParam) {
    var coinListFromAPI, foundCoin;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          // 상태 초기화
          appState = {
            coins: [],
            selectedCoinId: urlCoinSymbolParam || '',
            // URL 파라미터로 초기 코인 설정 시도
            investmentAmount: 1000,
            investmentPeriod: 30,
            simulationResult: null,
            isLoading: true,
            // 초기 코인 목록 로딩
            error: ''
          };
          updateFormInputsState(); // 입력 필드 초기 상태 (로딩 중이므로 비활성화)
          updateResultsArea(); // 초기 로딩 메시지 또는 안내
          _context4.prev = 3;
          _context4.next = 6;
          return fetchCoinList();
        case 6:
          coinListFromAPI = _context4.sent;
          appState.coins = coinListFromAPI;

          // URL 파라미터로 전달된 코인이 유효한지 확인하고 selectedCoinId 설정
          if (urlCoinSymbolParam) {
            foundCoin = appState.coins.find(function (c) {
              return c.symbol === urlCoinSymbolParam || c.id === urlCoinSymbolParam;
            });
            if (foundCoin) {
              appState.selectedCoinId = foundCoin.id;
            } else if (appState.coins.length > 0) {
              // URL 코인이 없으면 첫번째 코인
              appState.selectedCoinId = appState.coins[0].id;
            }
          } else if (appState.coins.length > 0) {
            // URL 파라미터 없고 코인 목록 있으면 첫번째 코인
            appState.selectedCoinId = appState.coins[0].id;
          }
          populateCoinSelect(); // 코인 목록으로 <select> 채우기
          _context4.next = 17;
          break;
        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](3);
          appState.error = '코인 목록을 불러오는 데 실패했습니다.';
          console.error(_context4.t0);
          updateErrorMessage();
        case 17:
          _context4.prev = 17;
          appState.isLoading = false;
          updateFormInputsState(); // 입력 필드 활성화 및 값 설정
          updateResultsArea(); // 초기 안내 메시지 표시 (로딩 완료)
          return _context4.finish(17);
        case 22:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[3, 12, 17, 22]]);
  }));
  return _initializePage.apply(this, arguments);
}
function renderInvestmentSimulationPage(appContainer, param) {
  createPageLayout(appContainer);
  initializePage(param); // param은 URL에서 전달된 코인 심볼일 수 있음
}
},{}],"pages/Discussion.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderDiscussionPage = renderDiscussionPage;
var _conapi = require("../app/api/conapi.js");
// pages/Discussion.js

// 샘플 게시글 데이터 (PostDetail.js에서도 이와 유사한 데이터를 사용)
var samplePosts = [{
  id: 1,
  coinSymbol: "BTC",
  title: "비트코인 지금이라도 타야할까요? 분위기가 심상치 않네요",
  author: "코린이탐험대",
  date: "2025-05-11 10:30",
  views: 1245,
  likes: 78,
  commentsCount: 32,
  prediction: "상승",
  content: "최근 비트코인 가격 변동성이 커지면서 많은 분들이 고민이실 것 같습니다. 저는 장기적으로 우상향 할 것이라고 보는데, 여러분의 생각은 어떠신가요? 함께 이야기 나눠봐요!"
}, {
  id: 2,
  coinSymbol: "ETH",
  title: "이더리움, 다음주 중요한 발표 예정! 미리 선점하세요",
  author: "정보분석가",
  date: "2025-05-10 15:45",
  views: 982,
  likes: 56,
  commentsCount: 24,
  prediction: "상승",
  content: "이더리움 재단에서 다음 주 중대 발표가 있을 예정이라는 소식입니다. 이번 발표 내용에 따라 시장에 큰 파장이 예상되니, 관심있게 지켜보시는 것이 좋겠습니다."
}, {
  id: 3,
  coinSymbol: "XRP",
  title: "리플 소송 결과 임박? 단기 변동성 주의하세요",
  author: "법률전문가",
  date: "2025-05-09 09:12",
  views: 756,
  likes: 23,
  commentsCount: 41,
  prediction: "중립",
  content: "리플과 SEC 간의 소송 결과가 곧 나올 것이라는 전망이 나오고 있습니다. 결과에 따라 가격이 급등락할 수 있으니, 투자에 각별히 유의하시기 바랍니다."
}, {
  id: 4,
  coinSymbol: "SOL",
  title: "솔라나 기반 밈코인, 다시 한번 불장 올까요?",
  author: "밈코인헌터",
  date: "2025-05-08 18:20",
  views: 634,
  likes: 89,
  commentsCount: 15,
  prediction: "상승",
  content: "최근 솔라나 네트워크의 안정성이 향상되면서 솔라나 기반 밈코인들이 다시 주목받고 있습니다. 제2의 봉크, 도그위프햇이 나올 수 있을지 기대되네요."
}, {
  id: 5,
  coinSymbol: "BTC",
  title: "단타매매 수익 인증합니다 (하루 +15%)",
  author: "스캘핑마스터",
  date: "2025-05-07 22:05",
  views: 2056,
  likes: 152,
  commentsCount: 68,
  prediction: "중립",
  content: "오늘 장중 변동성을 이용해서 짧게 수익 실현했습니다. 매매는 짧고 굵게! 다들 성투하세요~ (매매 내역 첨부)"
}];
function renderDiscussionPage(container) {
  var coinSymbolParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  // coinSymbol -> coinSymbolParam으로 변경 (함수 스코프 내 변수와 혼동 방지)
  container.innerHTML = "";
  var discussionContainer = document.createElement("div");
  discussionContainer.className = "discussion-container";
  var header = document.createElement("header");
  header.className = "discussion-header";
  var title = document.createElement("h2");
  // coinSymbolParam을 사용하여 현재 선택된 코인 정보 가져오기
  var selectedCoinInfo = _conapi.COIN_LIST.find(function (c) {
    return c.symbol === coinSymbolParam;
  });
  title.textContent = selectedCoinInfo ? "".concat(selectedCoinInfo.graphicSymbol || selectedCoinInfo.symbol, " ").concat(selectedCoinInfo.name, " \uAC8C\uC2DC\uD310") : "커뮤니티";
  header.appendChild(title);
  discussionContainer.appendChild(header);
  var tabMenu = document.createElement("div");
  tabMenu.className = "discussion-tabs";
  var tabs = ["인기", "최신", "상승예측", "하락예측"];
  tabs.forEach(function (tabName) {
    var tabButton = document.createElement("button");
    tabButton.className = tabName === "인기" ? "tab-button active" : "tab-button";
    tabButton.textContent = tabName;
    tabButton.addEventListener("click", function (e) {
      document.querySelectorAll(".discussion-tabs .tab-button").forEach(function (btn) {
        return btn.classList.remove("active");
      });
      e.target.classList.add("active");
      filterDiscussions(tabName, postsList);
    });
    tabMenu.appendChild(tabButton);
  });
  discussionContainer.appendChild(tabMenu);
  var topControls = document.createElement("div");
  topControls.className = "discussion-top-controls";
  var coinFilter = document.createElement("div");
  coinFilter.className = "coin-filter";
  var filterLabel = document.createElement("label");
  filterLabel.htmlFor = "coin-filter-select";
  filterLabel.textContent = "종목:";
  coinFilter.appendChild(filterLabel);
  var selectCoin = document.createElement("select");
  selectCoin.id = "coin-filter-select";
  var allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "전체";
  selectCoin.appendChild(allOption);
  _conapi.COIN_LIST.forEach(function (coin) {
    var option = document.createElement("option");
    option.value = coin.symbol;
    option.textContent = "".concat(coin.name, " (").concat(coin.symbol, ")");
    if (coin.symbol === coinSymbolParam) {
      // coinSymbol -> coinSymbolParam
      option.selected = true;
    }
    selectCoin.appendChild(option);
  });
  selectCoin.addEventListener('change', function (e) {
    window.location.hash = e.target.value ? "#discussion/".concat(e.target.value) : '#discussion';
  });
  coinFilter.appendChild(selectCoin);
  topControls.appendChild(coinFilter);
  var searchBox = document.createElement("div");
  searchBox.className = "search-box";
  var searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "게시글 검색...";
  searchBox.appendChild(searchInput);
  var searchButton = document.createElement("button");
  searchButton.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\"></path></svg>";
  searchButton.addEventListener("click", function () {
    alert("\"".concat(searchInput.value, "\" \uAC80\uC0C9 \uACB0\uACFC (\uAD6C\uD604 \uC608\uC815)"));
  });
  searchBox.appendChild(searchButton);
  topControls.appendChild(searchBox);
  var writeButton = document.createElement("button");
  writeButton.className = "write-button";
  writeButton.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"18\" height=\"18\"><path d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"></path></svg> \uC0C8 \uAE00 \uC791\uC131";
  writeButton.addEventListener("click", function () {
    showWriteForm(coinSymbolParam); // 현재 필터링된 코인 심볼 전달
  });
  topControls.appendChild(writeButton);
  discussionContainer.appendChild(topControls);
  var postsArea = document.createElement("div");
  postsArea.className = "posts-area";
  var postsList = document.createElement("ul");
  postsList.className = "posts-list";
  // coinSymbolParam을 사용하여 초기 게시글 필터링
  createSamplePosts(postsList, coinSymbolParam);
  postsArea.appendChild(postsList);
  discussionContainer.appendChild(postsArea);
  var pagination = document.createElement("div");
  pagination.className = "pagination";
  for (var i = 1; i <= 5; i++) {
    var pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    if (i === 1) pageLink.className = "active";
    pagination.appendChild(pageLink);
  }
  discussionContainer.appendChild(pagination);
  container.appendChild(discussionContainer);
}
function createSamplePosts(listContainer) {
  var currentCoinSymbol = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  listContainer.innerHTML = '';

  // 현재 선택된 코인 심볼에 따라 게시글 필터링
  var filteredPosts = currentCoinSymbol ? samplePosts.filter(function (post) {
    return post.coinSymbol === currentCoinSymbol;
  }) : samplePosts;
  if (filteredPosts.length === 0) {
    var _COIN_LIST$find;
    var noPostsMessage = document.createElement("p");
    noPostsMessage.className = "filter-message"; // 스타일 적용을 위한 클래스
    noPostsMessage.textContent = currentCoinSymbol ? "".concat(((_COIN_LIST$find = _conapi.COIN_LIST.find(function (c) {
      return c.symbol === currentCoinSymbol;
    })) === null || _COIN_LIST$find === void 0 ? void 0 : _COIN_LIST$find.name) || currentCoinSymbol, " \uAD00\uB828 \uAC8C\uC2DC\uAE00\uC774 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4.") : "게시글이 아직 없습니다. 첫 글을 작성해보세요!";
    listContainer.appendChild(noPostsMessage);
    return;
  }
  filteredPosts.forEach(function (post) {
    var postItem = document.createElement("li");
    postItem.className = "post-item";
    postItem.dataset.postId = post.id; // 데이터 속성으로 post ID 저장
    postItem.addEventListener('click', function () {
      // ✅ 상세 페이지로 이동
      window.location.hash = "post/".concat(post.id);
    });
    var postCardHeader = document.createElement("div");
    postCardHeader.className = "post-card-header";
    var authorInfo = document.createElement("div");
    authorInfo.className = "post-author-info";
    var authorAvatar = document.createElement("span");
    authorAvatar.className = "post-author-avatar";
    authorAvatar.textContent = post.author.charAt(0).toUpperCase();
    var authorNameAndDate = document.createElement("div");
    authorNameAndDate.className = "post-author-name-date";
    var authorName = document.createElement("span");
    authorName.className = "post-author-name";
    authorName.textContent = post.author;
    var postDate = document.createElement("span");
    postDate.className = "post-date";
    postDate.textContent = post.date;
    authorNameAndDate.appendChild(authorName);
    authorNameAndDate.appendChild(postDate);
    authorInfo.appendChild(authorAvatar);
    authorInfo.appendChild(authorNameAndDate);
    var rightHeaderItems = document.createElement("div"); // 오른쪽 상단 요소들을 묶을 div
    rightHeaderItems.className = "post-card-header-right";
    if (post.prediction && post.prediction !== "예측 없음") {
      var predictionTag = document.createElement("span");
      predictionTag.className = "prediction-tag ".concat(post.prediction);
      predictionTag.textContent = post.prediction;
      rightHeaderItems.appendChild(predictionTag);
    }

    // 코인 태그 추가 (게시글 데이터에 coinSymbol이 있다고 가정)
    if (post.coinSymbol) {
      var coin = _conapi.COIN_LIST.find(function (c) {
        return c.symbol === post.coinSymbol;
      });
      if (coin) {
        var coinTag = document.createElement("span");
        coinTag.className = "post-item-coin-tag";
        coinTag.textContent = "".concat(coin.graphicSymbol || coin.symbol);
        coinTag.title = coin.name;
        rightHeaderItems.appendChild(coinTag);
      }
    }
    postCardHeader.appendChild(authorInfo);
    postCardHeader.appendChild(rightHeaderItems);
    var postCardBody = document.createElement("div");
    postCardBody.className = "post-card-body";
    var postTitle = document.createElement("h3");
    postTitle.className = "post-title";
    postTitle.textContent = post.title;
    var postExcerpt = document.createElement("p");
    postExcerpt.className = "post-excerpt";
    postExcerpt.textContent = post.content.substring(0, 120) + (post.content.length > 120 ? "..." : "");
    postCardBody.appendChild(postTitle);
    postCardBody.appendChild(postExcerpt);
    var postCardFooter = document.createElement("div");
    postCardFooter.className = "post-card-footer";
    var postStats = document.createElement("div");
    postStats.className = "post-stats";
    postStats.innerHTML = "\n      <span><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"></path></svg> ".concat(post.views, "</span>\n      <span><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z\"></path></svg> ").concat(post.likes, "</span>\n      <span><svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z\"></path></svg> ").concat(post.commentsCount, "</span>\n    "); // post.comments -> post.commentsCount
    var postActions = document.createElement("div");
    postActions.className = "post-actions";
    var likeButton = document.createElement("button");
    likeButton.className = "action-button like-button";
    likeButton.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z\"></path></svg><span>\uC88B\uC544\uC694</span>";
    var commentButton = document.createElement("button");
    commentButton.className = "action-button comment-button";
    commentButton.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z\"></path></svg><span>\uB313\uAE00</span>";

    // 이벤트 전파 방지
    likeButton.addEventListener('click', function (e) {
      e.stopPropagation();
      alert('좋아요 기능 구현 예정');
    });
    commentButton.addEventListener('click', function (e) {
      e.stopPropagation();
      alert('댓글 기능 구현 예정');
    });
    postActions.appendChild(likeButton);
    postActions.appendChild(commentButton);
    postCardFooter.appendChild(postStats);
    postCardFooter.appendChild(postActions);
    postItem.appendChild(postCardHeader);
    postItem.appendChild(postCardBody);
    postItem.appendChild(postCardFooter);
    listContainer.appendChild(postItem);
  });
}
function filterDiscussions(tabName, listContainer) {
  var _document$getElementB;
  var currentCoinSymbol = ((_document$getElementB = document.getElementById("coin-filter-select")) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || "";
  console.log("".concat(tabName, " \uD0ED \uC120\uD0DD\uB428. \uCF54\uC778: ").concat(currentCoinSymbol || '전체', ". \uAC8C\uC2DC\uAE00 \uD544\uD130\uB9C1 (\uD604\uC7AC\uB294 \uC0D8\uD50C\uB370\uC774\uD130 \uC7AC\uB85C\uB4DC)"));
  // TODO: 실제 구현 시, API를 호출하여 해당 탭과 코인 필터에 맞는 데이터를 가져오고 listContainer를 업데이트.
  createSamplePosts(listContainer, currentCoinSymbol); // 필터링된 코인 심볼 전달
}
function showWriteForm() {
  var currentCoinSymbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var existingForm = document.querySelector(".write-form-overlay");
  if (existingForm) existingForm.remove();
  var writeFormOverlay = document.createElement("div");
  writeFormOverlay.className = "write-form-overlay";
  writeFormOverlay.addEventListener("click", function (e) {
    if (e.target === writeFormOverlay) {
      document.body.removeChild(writeFormOverlay);
    }
  });
  var writeForm = document.createElement("div");
  writeForm.className = "write-form";
  var formHeader = document.createElement("h3");
  formHeader.textContent = "새 글 작성";

  // 코인 선택 드롭다운 (글쓰기 폼 내부)
  var formCoinSelectLabel = document.createElement("label");
  formCoinSelectLabel.textContent = "코인 선택 (선택 사항):";
  formCoinSelectLabel.style.display = "block";
  formCoinSelectLabel.style.marginBottom = "5px";
  var formCoinSelect = document.createElement("select");
  formCoinSelect.style.width = "100%";
  formCoinSelect.style.marginBottom = "15px";
  var noCoinOption = document.createElement("option");
  noCoinOption.value = "";
  noCoinOption.textContent = "코인 선택 안 함";
  formCoinSelect.appendChild(noCoinOption);
  _conapi.COIN_LIST.forEach(function (coin) {
    var option = document.createElement("option");
    option.value = coin.symbol;
    option.textContent = "".concat(coin.name, " (").concat(coin.symbol, ")");
    if (coin.symbol === currentCoinSymbol) {
      // 현재 토론방 필터 코인 기본 선택
      option.selected = true;
    }
    formCoinSelect.appendChild(option);
  });
  var titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "제목을 입력하세요";
  var contentTextarea = document.createElement("textarea");
  contentTextarea.placeholder = "내용을 입력하세요";
  contentTextarea.rows = 8; // 줄 수 조정

  var predictionDiv = document.createElement('div');
  predictionDiv.style.marginBottom = '15px';
  predictionDiv.style.marginTop = '10px';
  var predictionLabel = document.createElement("label");
  predictionLabel.textContent = "예측: ";
  predictionLabel.style.marginRight = "10px";
  var predictionSelect = document.createElement("select");
  ["예측 없음", "상승", "하락", "중립"].forEach(function (pred) {
    var option = document.createElement("option");
    option.value = pred;
    option.textContent = pred;
    predictionSelect.appendChild(option);
  });
  predictionDiv.appendChild(predictionLabel);
  predictionDiv.appendChild(predictionSelect);
  var buttonArea = document.createElement("div");
  buttonArea.className = "form-buttons";
  var cancelButton = document.createElement("button");
  cancelButton.textContent = "취소";
  cancelButton.className = "cancel-button";
  cancelButton.addEventListener("click", function () {
    document.body.removeChild(writeFormOverlay);
  });
  var submitButton = document.createElement("button");
  submitButton.textContent = "등록";
  submitButton.className = "submit-button";
  submitButton.addEventListener("click", function () {
    var _document$querySelect;
    if (!titleInput.value.trim() || !contentTextarea.value.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    var newPost = {
      id: samplePosts.length + 1,
      // 임시 ID
      coinSymbol: formCoinSelect.value,
      title: titleInput.value,
      author: "현재사용자",
      // 임시 작성자
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      views: 0,
      likes: 0,
      commentsCount: 0,
      prediction: predictionSelect.value === "예측 없음" ? "중립" : predictionSelect.value,
      content: contentTextarea.value
    };
    samplePosts.unshift(newPost); // 새 글을 맨 앞에 추가
    filterDiscussions(((_document$querySelect = document.querySelector('.discussion-tabs .tab-button.active')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.textContent) || '최신', document.querySelector('.posts-list')); // 목록 새로고침
    alert("게시글이 등록되었습니다.");
    document.body.removeChild(writeFormOverlay);
  });
  buttonArea.appendChild(cancelButton);
  buttonArea.appendChild(submitButton);
  writeForm.appendChild(formHeader);
  writeForm.appendChild(formCoinSelectLabel);
  writeForm.appendChild(formCoinSelect);
  writeForm.appendChild(titleInput);
  writeForm.appendChild(contentTextarea);
  writeForm.appendChild(predictionDiv);
  writeForm.appendChild(buttonArea);
  writeFormOverlay.appendChild(writeForm);
  document.body.appendChild(writeFormOverlay);
}
},{"../app/api/conapi.js":"app/api/conapi.js"}],"pages/PostDetail.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPostDetailPage = renderPostDetailPage;
var _conapi = require("../app/api/conapi.js");
// pages/PostDetail.js

// Discussion.js와 동일한 샘플 데이터를 사용 (실제로는 API 호출 또는 props/상태 관리로 전달)
var samplePostsData = [{
  id: 1,
  coinSymbol: "BTC",
  title: "비트코인 지금이라도 타야할까요? 분위기가 심상치 않네요",
  author: "코린이탐험대",
  date: "2025-05-11 10:30",
  views: 1245,
  likes: 78,
  commentsCount: 32,
  prediction: "상승",
  content: "최근 비트코인 가격 변동성이 커지면서 많은 분들이 고민이실 것 같습니다. 저는 장기적으로 우상향 할 것이라고 보는데, 여러분의 생각은 어떠신가요? 함께 이야기 나눠봐요!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n두 번째 단락입니다. 여기에는 조금 더 긴 내용이 들어갈 수 있습니다. 게시글 상세 페이지에서는 전체 내용을 보여주는 것이 중요합니다. 사용자들이 충분한 정보를 얻을 수 있도록 상세하게 작성하는 것이 좋습니다."
}, {
  id: 2,
  coinSymbol: "ETH",
  title: "이더리움, 다음주 중요한 발표 예정! 미리 선점하세요",
  author: "정보분석가",
  date: "2025-05-10 15:45",
  views: 982,
  likes: 56,
  commentsCount: 24,
  prediction: "상승",
  content: "이더리움 재단에서 다음 주 중대 발표가 있을 예정이라는 소식입니다. 이번 발표 내용에 따라 시장에 큰 파장이 예상되니, 관심있게 지켜보시는 것이 좋겠습니다. \n\n상세 내용은 다음과 같습니다: [상세 내용] 이 부분은 추후 업데이트될 예정입니다."
}, {
  id: 3,
  coinSymbol: "XRP",
  title: "리플 소송 결과 임박? 단기 변동성 주의하세요",
  author: "법률전문가",
  date: "2025-05-09 09:12",
  views: 756,
  likes: 23,
  commentsCount: 41,
  prediction: "중립",
  content: "리플과 SEC 간의 소송 결과가 곧 나올 것이라는 전망이 나오고 있습니다. 결과에 따라 가격이 급등락할 수 있으니, 투자에 각별히 유의하시기 바랍니다. \n\n법률적인 관점에서 볼 때, 이번 소송은 암호화폐 시장 전체에 큰 영향을 미칠 수 있는 중요한 사건입니다."
}, {
  id: 4,
  coinSymbol: "SOL",
  title: "솔라나 기반 밈코인, 다시 한번 불장 올까요?",
  author: "밈코인헌터",
  date: "2025-05-08 18:20",
  views: 634,
  likes: 89,
  commentsCount: 15,
  prediction: "상승",
  content: "최근 솔라나 네트워크의 안정성이 향상되면서 솔라나 기반 밈코인들이 다시 주목받고 있습니다. 제2의 봉크, 도그위프햇이 나올 수 있을지 기대되네요. \n\n밈코인 투자는 매우 높은 변동성을 동반하므로, 신중한 접근이 필요합니다."
}, {
  id: 5,
  coinSymbol: "BTC",
  title: "단타매매 수익 인증합니다 (하루 +15%)",
  author: "스캘핑마스터",
  date: "2025-05-07 22:05",
  views: 2056,
  likes: 152,
  commentsCount: 68,
  prediction: "중립",
  content: "오늘 장중 변동성을 이용해서 짧게 수익 실현했습니다. 매매는 짧고 굵게! 다들 성투하세요~ (매매 내역 첨부)\n\n차트 분석과 빠른 판단이 단타 매매의 핵심입니다. 첨부된 이미지를 통해 실제 매매 타점을 확인해보세요."
}];

// 임시 댓글 데이터
var sampleComments = [{
  id: 1,
  postId: 1,
  author: "댓글러1",
  date: "2025-05-11 11:00",
  content: "좋은 분석 감사합니다! 저도 장기적으로 보고 있어요."
}, {
  id: 2,
  postId: 1,
  author: "BTC신봉자",
  date: "2025-05-11 11:30",
  content: "비트코인은 결국 우상향입니다. 걱정마세요!"
}, {
  id: 3,
  postId: 2,
  author: "이더최고",
  date: "2025-05-10 16:00",
  content: "정보 감사합니다. 기대되네요!"
}];
function renderPostDetailPage(container, postIdStr) {
  container.innerHTML = "";
  var postId = parseInt(postIdStr);
  var post = samplePostsForDetail.find(function (p) {
    return p.id === postId;
  });
  var pageWrapper = document.createElement("div");
  pageWrapper.className = "post-detail-page-wrapper";
  if (!post) {
    pageWrapper.innerHTML = "<p class=\"error-message\">\uC694\uCCAD\uD558\uC2E0 \uAC8C\uC2DC\uAE00\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. (ID: ".concat(postIdStr, ")</p>");
    var backButton = document.createElement("button");
    backButton.className = "back-to-list-button top";
    backButton.textContent = "목록으로 돌아가기";
    backButton.onclick = function () {
      window.location.hash = "#discussion";
    };
    pageWrapper.insertBefore(backButton, pageWrapper.firstChild);
    container.appendChild(pageWrapper);
    return;
  }
  var coinInfo = _conapi.COIN_LIST.find(function (c) {
    return c.symbol === post.coinSymbol;
  });

  // 상단: 목록으로 가기 버튼
  var backButtonTop = document.createElement("button");
  backButtonTop.className = "back-to-list-button top";
  backButtonTop.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"></path></svg> \uBAA9\uB85D\uC73C\uB85C";
  backButtonTop.onclick = function () {
    window.location.hash = "#discussion".concat(post.coinSymbol ? '/' + post.coinSymbol : '');
  };
  pageWrapper.appendChild(backButtonTop);

  // 게시글 컨테이너
  var postDetailContainer = document.createElement("article");
  postDetailContainer.className = "post-detail-container";

  // 헤더
  var header = document.createElement("header");
  header.className = "post-detail-header";
  var title = document.createElement("h1");
  title.className = "post-detail-title";
  title.textContent = post.title;
  if (coinInfo) {
    var coinTag = document.createElement("span");
    coinTag.className = "post-detail-coin-tag";
    coinTag.textContent = "".concat(coinInfo.graphicSymbol || coinInfo.symbol, " ").concat(coinInfo.name);
    coinTag.onclick = function () {
      return window.location.hash = "#coin/".concat(coinInfo.symbol);
    };
    header.appendChild(coinTag);
  }
  header.appendChild(title);

  // 메타 정보 (작성자, 날짜, 조회수 등)
  var metaInfo = document.createElement("div");
  metaInfo.className = "post-detail-meta";
  var authorAvatar = document.createElement("span");
  authorAvatar.className = "post-author-avatar detail-avatar"; // 추가 클래스
  authorAvatar.textContent = post.author.charAt(0).toUpperCase();
  var authorName = document.createElement("span");
  authorName.className = "post-author-name";
  authorName.textContent = post.author;
  var postDate = document.createElement("span");
  postDate.className = "post-date";
  postDate.textContent = "\uC791\uC131\uC77C: ".concat(post.date);
  var views = document.createElement("span");
  views.className = "post-views";
  views.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\"><path fill=\"currentColor\" d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"></path></svg> ".concat(post.views);
  if (post.prediction && post.prediction !== "예측 없음") {
    var predictionTag = document.createElement("span");
    predictionTag.className = "prediction-tag ".concat(post.prediction, " detail-tag");
    predictionTag.textContent = post.prediction;
    metaInfo.appendChild(predictionTag);
  }
  metaInfo.appendChild(authorAvatar);
  metaInfo.appendChild(authorName);
  metaInfo.appendChild(postDate);
  metaInfo.appendChild(views);
  header.appendChild(metaInfo);
  postDetailContainer.appendChild(header);

  // 본문 내용
  var content = document.createElement("div");
  content.className = "post-detail-content";
  // content.textContent = post.content; // 단순 텍스트일 경우
  // HTML 내용을 허용하려면 innerHTML 사용 (보안 주의) 또는 Markdown 파서 사용
  // 여기서는 \n을 <br>로 변환하여 줄바꿈 표시
  content.innerHTML = post.content.replace(/\n/g, "<br>");
  postDetailContainer.appendChild(content);

  // 하단 액션 (좋아요, 공유 등 - 임시)
  var actions = document.createElement("div");
  actions.className = "post-detail-actions";
  var likeButton = document.createElement("button");
  likeButton.className = "action-button like-button";
  likeButton.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\"><path fill=\"currentColor\" d=\"M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z\"></path></svg> \uC88B\uC544\uC694 (".concat(post.likes, ")");
  // TODO: 좋아요 기능 구현
  actions.appendChild(likeButton);
  // 다른 액션 버튼들 (예: 수정, 삭제 - 권한 필요)
  postDetailContainer.appendChild(actions);
  pageWrapper.appendChild(postDetailContainer);

  // 댓글 섹션
  var commentsSection = document.createElement("section");
  commentsSection.className = "comments-section";
  var commentsTitle = document.createElement("h3");
  commentsTitle.textContent = "\uB313\uAE00 (".concat(post.commentsCount || 0, ")"); // Discussion.js samplePosts에 commentsCount 추가 가정
  commentsSection.appendChild(commentsTitle);
  var commentForm = document.createElement("form");
  commentForm.className = "comment-form";
  var commentTextarea = document.createElement("textarea");
  commentTextarea.placeholder = "댓글을 입력하세요...";
  commentTextarea.rows = 3;
  var commentSubmitButton = document.createElement("button");
  commentSubmitButton.type = "submit";
  commentSubmitButton.textContent = "댓글 등록";
  commentForm.appendChild(commentTextarea);
  commentForm.appendChild(commentSubmitButton);
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (commentTextarea.value.trim()) {
      alert("\uB313\uAE00: \"".concat(commentTextarea.value, "\" (\uB4F1\uB85D \uAE30\uB2A5 \uAD6C\uD604 \uC608\uC815)"));
      commentTextarea.value = "";
      // TODO: 댓글 등록 및 목록 업데이트 로직
    }
  });
  commentsSection.appendChild(commentForm);
  var commentsList = document.createElement("ul");
  commentsList.className = "comments-list";
  var postComments = sampleComments.filter(function (comment) {
    return comment.postId === postId;
  });
  if (postComments.length > 0) {
    postComments.forEach(function (comment) {
      var commentItem = document.createElement("li");
      commentItem.className = "comment-item";
      commentItem.innerHTML = "\n        <div class=\"comment-author-info\">\n          <span class=\"post-author-avatar comment-avatar\">".concat(comment.author.charAt(0).toUpperCase(), "</span>\n          <span class=\"post-author-name\">").concat(comment.author, "</span>\n          <span class=\"post-date\">").concat(comment.date, "</span>\n        </div>\n        <p class=\"comment-content\">").concat(comment.content, "</p>\n      ");
      commentsList.appendChild(commentItem);
    });
  } else {
    var noComments = document.createElement("p");
    noComments.textContent = "아직 댓글이 없습니다.";
    noComments.className = "no-comments";
    commentsList.appendChild(noComments);
  }
  commentsSection.appendChild(commentsList);
  pageWrapper.appendChild(commentsSection);

  // 하단: 목록으로 가기 버튼
  var backButtonBottom = document.createElement("button");
  backButtonBottom.className = "back-to-list-button bottom";
  backButtonBottom.innerHTML = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"></path></svg> \uBAA9\uB85D\uC73C\uB85C";
  backButtonBottom.onclick = function () {
    window.location.hash = "#discussion".concat(post.coinSymbol ? '/' + post.coinSymbol : '');
  };
  pageWrapper.appendChild(backButtonBottom);
  container.appendChild(pageWrapper);
}

// PostDetail.js에서 사용할 샘플 데이터 (Discussion.js의 데이터와 동일하거나 확장)
var samplePostsForDetail = [{
  id: 1,
  coinSymbol: "BTC",
  title: "비트코인 지금이라도 타야할까요? 분위기가 심상치 않네요",
  author: "코린이탐험대",
  date: "2025-05-11 10:30",
  views: 1245,
  likes: 78,
  commentsCount: 2,
  prediction: "상승",
  content: "최근 비트코인 가격 변동성이 커지면서 많은 분들이 고민이실 것 같습니다. 저는 장기적으로 우상향 할 것이라고 보는데, 여러분의 생각은 어떠신가요? 함께 이야기 나눠봐요!\n\n추가 내용: 비트코인의 역사적 데이터를 살펴보면, 큰 하락 이후에는 항상 더 큰 상승이 있었습니다. 물론 과거가 미래를 보장하는 것은 아니지만, 현재 시장 상황과 여러 지표들을 종합적으로 고려했을 때 긍정적인 신호들이 많이 보입니다. 특히 기관 투자자들의 유입과 ETF 승인 가능성 등은 장기적인 상승 동력이 될 수 있습니다.\n\n다만, 단기적인 변동성은 여전히 클 수 있으므로 투자에는 항상 신중해야 합니다. 분할 매수와 리스크 관리는 필수입니다!"
}, {
  id: 2,
  coinSymbol: "ETH",
  title: "이더리움, 다음주 중요한 발표 예정! 미리 선점하세요",
  author: "정보분석가",
  date: "2025-05-10 15:45",
  views: 982,
  likes: 56,
  commentsCount: 1,
  prediction: "상승",
  content: "이더리움 재단에서 다음 주 중대 발표가 있을 예정이라는 소식입니다. 이번 발표 내용에 따라 시장에 큰 파장이 예상되니, 관심있게 지켜보시는 것이 좋겠습니다. \n\n들리는 소문에 의하면, 이번 발표는 이더리움 2.0 업그레이드의 다음 단계와 관련된 로드맵, 그리고 새로운 확장성 솔루션에 대한 내용일 가능성이 높다고 합니다. 만약 이것이 사실이라면 이더리움 생태계에 엄청난 호재로 작용할 수 있습니다."
}, {
  id: 3,
  coinSymbol: "XRP",
  title: "리플 소송 결과 임박? 단기 변동성 주의하세요",
  author: "법률전문가",
  date: "2025-05-09 09:12",
  views: 756,
  likes: 23,
  commentsCount: 0,
  prediction: "중립",
  content: "리플과 SEC 간의 소송 결과가 곧 나올 것이라는 전망이 나오고 있습니다. 결과에 따라 가격이 급등락할 수 있으니, 투자에 각별히 유의하시기 바랍니다. \n\n현재까지 나온 정보들을 종합해 보면, 완전한 승소나 패소보다는 양측에 일부 유리한 판결이 나올 가능성이 점쳐지고 있습니다. 하지만 법원의 최종 판단은 예측하기 어려우므로, 결과 발표 전후로 변동성이 극심해질 수 있습니다. 투자자들은 관련 뉴스에 귀를 기울이고, 리스크 관리에 만전을 기해야 할 것입니다."
}, {
  id: 4,
  coinSymbol: "SOL",
  title: "솔라나 기반 밈코인, 다시 한번 불장 올까요?",
  author: "밈코인헌터",
  date: "2025-05-08 18:20",
  views: 634,
  likes: 89,
  commentsCount: 0,
  prediction: "상승",
  content: "최근 솔라나 네트워크의 안정성이 향상되면서 솔라나 기반 밈코인들이 다시 주목받고 있습니다. 제2의 봉크, 도그위프햇이 나올 수 있을지 기대되네요. \n\n특히 최근 출시된 몇몇 밈코인들이 커뮤니티의 강력한 지지를 받으며 빠르게 성장하고 있습니다. 하지만 밈코인 투자는 하이 리스크 하이 리턴의 전형적인 예이므로, 투자금의 극히 일부만으로 재미삼아 접근하는 것이 현명할 수 있습니다."
}, {
  id: 5,
  coinSymbol: "BTC",
  title: "단타매매 수익 인증합니다 (하루 +15%)",
  author: "스캘핑마스터",
  date: "2025-05-07 22:05",
  views: 2056,
  likes: 152,
  commentsCount: 0,
  prediction: "중립",
  content: "오늘 장중 변동성을 이용해서 짧게 수익 실현했습니다. 매매는 짧고 굵게! 다들 성투하세요~ (매매 내역 첨부)\n\n저의 주요 전략은 지지선과 저항선을 활용한 돌파 매매입니다. 오늘은 비트코인이 주요 지지선에서 반등하는 모습을 포착하여 매수했고, 단기 저항선 부근에서 빠르게 매도하여 수익을 확정했습니다. 시장 상황이 유동적이므로 항상 손절 라인을 설정하고 기계적으로 대응하는 것이 중요합니다."
}];
},{"../app/api/conapi.js":"app/api/conapi.js"}],"pages/Login.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLoginPage = renderLoginPage;
// pages/Login.js

function renderLoginPage(container) {
  container.innerHTML = ""; // 이전 내용 지우기

  var loginPageWrapper = document.createElement("div");
  loginPageWrapper.className = "login-page-wrapper";
  var loginFormContainer = document.createElement("div");
  loginFormContainer.className = "login-form-container";
  var formTitle = document.createElement("h2");
  formTitle.className = "login-form-title";
  formTitle.textContent = "로그인";
  var formDescription = document.createElement("p");
  formDescription.className = "login-form-description";
  formDescription.textContent = "계정에 로그인하여 모든 기능을 이용하세요.";
  var form = document.createElement("form");
  form.id = "loginForm";
  form.addEventListener("submit", handleLoginSubmit);

  // 이메일 입력 필드
  var emailGroup = document.createElement("div");
  emailGroup.className = "form-group";
  var emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email";
  emailLabel.textContent = "이메일 주소";
  var emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.placeholder = "you@example.com";
  emailInput.required = true;
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);

  // 비밀번호 입력 필드
  var passwordGroup = document.createElement("div");
  passwordGroup.className = "form-group";
  var passwordLabel = document.createElement("label");
  passwordLabel.htmlFor = "password";
  passwordLabel.textContent = "비밀번호";
  var passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.placeholder = "••••••••";
  passwordInput.required = true;
  // Caps Lock 감지 이벤트 리스너
  passwordInput.addEventListener("keyup", handleCapsLock);
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  // Caps Lock 알림
  var capsLockWarning = document.createElement("div");
  capsLockWarning.id = "capsLockWarning";
  capsLockWarning.className = "caps-lock-warning";
  capsLockWarning.style.display = "none"; // 기본 숨김
  capsLockWarning.textContent = "Caps Lock이 켜져 있습니다.";
  passwordGroup.appendChild(capsLockWarning);

  // 추가 옵션 (기억하기, 비밀번호 찾기)
  var extraOptions = document.createElement("div");
  extraOptions.className = "extra-options";
  var rememberMeLabel = document.createElement("label");
  rememberMeLabel.className = "remember-me";
  var rememberMeCheckbox = document.createElement("input");
  rememberMeCheckbox.type = "checkbox";
  rememberMeCheckbox.name = "remember";
  rememberMeLabel.appendChild(rememberMeCheckbox);
  rememberMeLabel.append(" 로그인 상태 유지");
  var forgotPasswordLink = document.createElement("a");
  forgotPasswordLink.href = "#/forgot-password"; // 실제 링크로 변경 필요
  forgotPasswordLink.className = "forgot-password-link";
  forgotPasswordLink.textContent = "비밀번호를 잊으셨나요?";
  extraOptions.appendChild(rememberMeLabel);
  extraOptions.appendChild(forgotPasswordLink);

  // 로그인 버튼
  var loginButton = document.createElement("button");
  loginButton.type = "submit";
  loginButton.className = "login-button primary";
  loginButton.textContent = "로그인";

  // 회원가입 링크
  var signUpPrompt = document.createElement("div");
  signUpPrompt.className = "signup-prompt";
  signUpPrompt.innerHTML = "\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694? <a href=\"#/signup\">\uD68C\uC6D0\uAC00\uC785</a>"; // 실제 회원가입 페이지로 연결

  // 폼 요소들 추가
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(extraOptions);
  form.appendChild(loginButton);
  loginFormContainer.appendChild(formTitle);
  loginFormContainer.appendChild(formDescription);
  loginFormContainer.appendChild(form);
  // 소셜 로그인 구분선 및 버튼 그룹 제거됨
  loginFormContainer.appendChild(signUpPrompt); // 로그인 버튼 다음에 바로 회원가입 프롬프트

  loginPageWrapper.appendChild(loginFormContainer);
  container.appendChild(loginPageWrapper);
}
function handleLoginSubmit(event) {
  event.preventDefault(); // 폼 기본 제출 방지
  var email = event.target.email.value;
  var password = event.target.password.value;
  var rememberMe = event.target.remember.checked;
  console.log("로그인 시도:", {
    email: email,
    password: password,
    rememberMe: rememberMe
  });
  // TODO: 실제 로그인 API 호출 및 로직 구현
  alert("\uB85C\uADF8\uC778 \uC2DC\uB3C4: ".concat(email, " (\uAD6C\uD604 \uC608\uC815)"));
  // 로그인 성공 시 메인 페이지 또는 이전 페이지로 리다이렉트
  // window.location.hash = "#main";
}
function handleCapsLock(event) {
  var capsLockWarning = document.getElementById("capsLockWarning");
  if (event.getModifierState && event.getModifierState("CapsLock")) {
    capsLockWarning.style.display = "block";
  } else {
    capsLockWarning.style.display = "none";
  }
}
},{}],"app/router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRouter = initRouter;
exports.updateRoute = updateRoute;
var _store = require("../components/store.js");
var _MainPage = require("../pages/MainPage.js");
var _CoinDetail = require("../pages/CoinDetail.js");
var _InvestmentSimulation = require("../pages/InvestmentSimulation.js");
var _Discussion = require("../pages/Discussion.js");
var _PostDetail = require("../pages/PostDetail.js");
var _Login = require("../pages/Login.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // app/router.js
// InvestmentSimulation.js 임포트 추가 (실제 export 방식에 따라 수정 필요)
function initRouter() {
  updateRoute();
  window.addEventListener("hashchange", updateRoute);
}
function updateRoute() {
  var container = document.getElementById("app");
  var hash = window.location.hash.substring(1) || "";
  if (hash.startsWith("/")) {
    hash = hash.substring(1);
  }
  var _hash$split = hash.split("/"),
    _hash$split2 = _slicedToArray(_hash$split, 2),
    path = _hash$split2[0],
    param = _hash$split2[1];
  console.log("현재 경로:", path, "파라미터:", param);

  // applyTheme(); // 페이지 변경 시 테마 적용 (필요시 주석 해제)

  switch (path) {
    case "":
    case "main":
      (0, _MainPage.renderMainPage)(container);
      break;
    case "prediction":
      (0, _InvestmentSimulation.renderInvestmentSimulationPage)(container, param); // 이렇게 변경
      break;
    case "discussion":
      (0, _Discussion.renderDiscussionPage)(container, param);
      break;
    case "coin":
      (0, _CoinDetail.renderCoinDetailPage)(container, param);
      break;
    case "post":
      (0, _PostDetail.renderPostDetailPage)(container, param);
      break;
    case "login":
      (0, _Login.renderLoginPage)(container);
      break;
    default:
      console.warn("\uC54C \uC218 \uC5C6\uB294 \uACBD\uB85C: ".concat(path));
      (0, _MainPage.renderMainPage)(container);
  }
}
},{"../components/store.js":"components/store.js","../pages/MainPage.js":"pages/MainPage.js","../pages/CoinDetail.js":"pages/CoinDetail.js","../pages/InvestmentSimulation.js":"pages/InvestmentSimulation.js","../pages/Discussion.js":"pages/Discussion.js","../pages/PostDetail.js":"pages/PostDetail.js","../pages/Login.js":"pages/Login.js"}],"app/app.js":[function(require,module,exports) {
"use strict";

var _router = require("./router.js");
var _store = require("../components/store.js");
// DOM 로드 후 초기화
document.addEventListener("DOMContentLoaded", function () {
  (0, _store.setupNavbar)();
  (0, _router.initRouter)();
});
},{"./router.js":"app/router.js","../components/store.js":"components/store.js"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "8846" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app/app.js"], null)
//# sourceMappingURL=/app.e87ca0bd.js.map