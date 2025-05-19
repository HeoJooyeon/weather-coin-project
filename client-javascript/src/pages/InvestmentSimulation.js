// src/pages/InvestmentSimulation.js

// 임시 API 모의 함수 (실제 구현 시 삭제 또는 주석 처리)
// 실제 프로젝트에서는 이 함수들을 공통 API 모듈 (예: ../app/api/conapi.js)로 옮기거나,
// 해당 모듈에서 import하여 사용하는 것이 좋습니다.
const fetchCoinList = async () => {
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 'Bitcoin', name: 'Bitcoin (BTC)', pair: 'BTCUSDT' },
    { id: 'Ethereum', name: 'Ethereum (ETH)', pair: 'ETHUSDT' },
    { id: 'Dogecoin', name: 'Dogecoin (DOGE)', pair: 'DOGEUSDT' },
    { id: 'Ripple', name: 'Ripple (XRP)', pair: 'XRPUSDT' },
    { id: 'Binance Coin', name: 'Binance Coin (BNB)', pair: 'BNBUSDT' },
    { id: 'Solana', name: 'Solana (SOL)', pair: 'SOLUSDT' },
    { id: 'Cardano', name: 'Cardano (ADA)', pair: 'ADAUSDT' },
    { id: 'TRON', name: 'TRON (TRX)', pair: 'TRXUSDT' },
    { id: 'Shiba Inu', name: 'Shiba Inu(SHIB)', pair: 'SHIBUSDT' },
    { id: 'Litecoin', name: 'Litecoin (LTC)', pair: 'LTCUSDT' }
  ]), 500));
};

const fetchHistoricalData = async (coinId, days) => {
  return new Promise(resolve => setTimeout(() => {
    const prices = [];
    let price = Math.random() * 50000 + 10000;
    for (let i = 0; i < days; i++) {
      prices.push(price);
      price *= (1 + (Math.random() - 0.48) * 0.1); // 약간의 변동성 추가
    }
    resolve(prices.reverse()); // 최신 데이터가 마지막에 오도록
  }, 1000));
};

// --- 페이지 상태 변수 ---
let appState = {
  coins: [],
  selectedCoinId: '',
  investmentAmount: 1000,
  investmentPeriod: 30,
  simulationResult: null,
  isLoading: false,
  error: '',
};

// --- DOM 요소 참조 변수 ---0
let pageElements = {
  container: null,
  coinSelect: null,
  amountInput: null,
  periodInput: null,
  simulateButton: null,
  errorMessage: null,
  resultsArea: null,
};

// --- 메타 정보 업데이트 함수 (Helmet 대체) ---
function updateMeta(title, description) {
  document.title = title;
  let metaDesc = document.querySelector('meta[name="description"]');
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
  const headerEl = document.createElement('header');
headerEl.className = 'page-header';

// h2와 p를 각각 따로 생성
const h2 = document.createElement('h2');
h2.textContent = '수익률 예측 시뮬레이션🔄';
h2.style.cursor = 'pointer'; // 클릭 가능하게 스타일 적용
h2.addEventListener('click', () => {
  // 결과 초기화
  appState.simulationResult = null;
  appState.error = '';
  updateResultsArea(); // 결과 영역 비우기
  updateErrorMessage(); // 오류 메시지도 숨기기
});

const p = document.createElement('p');
p.textContent = '과거 데이터를 기반으로 미래 투자 수익률을 예측해 보세요.';

headerEl.appendChild(h2);
headerEl.appendChild(p);
  pageElements.container.appendChild(headerEl);

  // 입력 폼 생성
  const formContainerEl = createFormElement();
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
  const formContainer = document.createElement('div');
  formContainer.className = 'simulation-form-container';

  const formGrid = document.createElement('div');
  formGrid.className = 'form-grid';

  // 코인 선택
  const coinGroup = document.createElement('div');
  coinGroup.className = 'form-group';
  const coinLabel = document.createElement('label');
  coinLabel.htmlFor = 'coin-select';
  coinLabel.textContent = '코인 선택:';
  pageElements.coinSelect = document.createElement('select');
  pageElements.coinSelect.id = 'coin-select';
  pageElements.coinSelect.addEventListener('change', (e) => {
    appState.selectedCoinId = e.target.value;
  });
  coinGroup.appendChild(coinLabel);
  coinGroup.appendChild(pageElements.coinSelect);
  formGrid.appendChild(coinGroup);

  // 투자 금액
const amountGroup = document.createElement('div');
amountGroup.className = 'form-group';

const amountLabel = document.createElement('label');
amountLabel.htmlFor = 'investment-amount';
amountLabel.textContent = '투자 금액 (₩):';

pageElements.amountInput = document.createElement('input');
pageElements.amountInput.type = 'number';
pageElements.amountInput.id = 'investment-amount';
pageElements.amountInput.placeholder = '일천원에서 일억원 사이 입력';  // 문구 변경
pageElements.amountInput.min = '1000';
pageElements.amountInput.max = '100000000';
//pageElements.amountInput.step = '1000';

// 검증
pageElements.amountInput.addEventListener('input', (e) => {
  const raw = e.target.value;

  // 입력이 빈칸일 경우: 상태 초기화
  if (raw.trim() === '') {
    appState.investmentAmount = 0;
    return;
  }

  // 숫자가 아니면 무시
  if (!/^\d+$/.test(raw)) return;

  const value = parseInt(raw, 10);
  appState.investmentAmount = value;
});

// 포커스 아웃될 때 값 보정
pageElements.amountInput.addEventListener('blur', (e) => {
  let value = parseInt(e.target.value, 10);

  // 최소값 보정
  if (value < 1000) value = 1000;

  // 최대값 보정
  if (value > 100000000) value = 100000000;

  // 1000원 단위 반올림
  if (value % 1000 !== 0) value = Math.round(value / 1000) * 1000;

  // 보정된 값을 input에 다시 반영
  e.target.value = value;

  // 상태 반영
  appState.investmentAmount = value;
});




amountGroup.appendChild(amountLabel);
amountGroup.appendChild(pageElements.amountInput);
formGrid.appendChild(amountGroup);


// 투자 기간 (과거 / 미래 선택형)
const periodGroup = document.createElement('div');
periodGroup.className = 'form-group';

// 라벨
const periodLabel = document.createElement('label');
periodLabel.textContent = '투자 기간 선택:';
periodGroup.appendChild(periodLabel);

// 탭 버튼 컨테이너
const tabContainer = document.createElement('div');
tabContainer.style.display = 'flex';
tabContainer.style.gap = '8px';
tabContainer.style.marginBottom = '10px';

// 과거 버튼
const pastButton = document.createElement('button');
pastButton.textContent = '과거';
pastButton.className = "timeBtn"
pastButton.type = 'button';
pastButton.className = 'tab-button selected'; // 선택 상태
tabContainer.appendChild(pastButton);
formContainer.appendChild(tabContainer);

// 미래 버튼
const futureButton = document.createElement('button');
futureButton.textContent = '미래';
futureButton.className = "timeBtn"
futureButton.type = 'button';
futureButton.className = 'tab-button';
tabContainer.appendChild(futureButton);

// 옵션 선택 
const periodSelect = document.createElement('select');
periodSelect.id = 'investment-period-select';
periodSelect.className = 'form-control';
formContainer.appendChild(tabContainer);
periodGroup.appendChild(periodSelect);

// 드롭다운 옵션 데이터
const options = {
  past: [
    { label: '1년 전', value: -365 },
    { label: '2년 전', value: -730 },
    { label: '3년 전', value: -1095 }
  ],
  future: [
    { label: '7일 후', value: 7 },
    { label: '15일 후', value: 15 },
    { label: '30일 후', value: 30 }
  ]
};

// 옵션 로딩 함수
function loadPeriodOptions(type) {
  periodSelect.innerHTML = ''; // 기존 옵션 제거
  options[type].forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    periodSelect.appendChild(option);
  });
  appState.investmentPeriod = parseInt(periodSelect.value, 10);
}

// 이벤트 연결
periodSelect.addEventListener('change', (e) => {
  appState.investmentPeriod = parseInt(e.target.value, 10);
});

pastButton.addEventListener('click', () => {
  pastButton.classList.add('selected');
  futureButton.classList.remove('selected');
  loadPeriodOptions('past');
});

futureButton.addEventListener('click', () => {
  futureButton.classList.add('selected');
  pastButton.classList.remove('selected');
  loadPeriodOptions('future');
});

// 기본값: 과거
loadPeriodOptions('past');

// 추가 구성요소 연결
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
  appState.coins.forEach(coin => {
    const option = document.createElement('option');
    option.value = coin.id; // API 응답의 id 사용
    option.textContent = `${coin.name} (${coin.pair})`;
    if (coin.id === appState.selectedCoinId) {
      option.selected = true;
    }
    pageElements.coinSelect.appendChild(option);
  });
  // selectedCoinId가 유효하지 않거나 설정되지 않은 경우, 목록의 첫 번째 코인을 기본값으로 설정
  if (!appState.coins.find(c => c.id === appState.selectedCoinId) && appState.coins.length > 0) {
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
    pageElements.simulateButton.innerHTML = appState.isLoading
      ? `<span class="spinner-sm" role="status" aria-hidden="true"></span> 계산 중...`
      : "예측 시작하기";
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
    pageElements.resultsArea.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner-lg" role="status"></div>
        <p>데이터를 분석하고 예측하는 중입니다...</p>
      </div>`;
  } else if (appState.simulationResult) {
    const { coinName, coinSymbol, initialInvestment, finalValue, profitOrLoss, returnRate, periodDays, futurePrice, initialPrice } = appState.simulationResult;
    const resultContainer = document.createElement('div');
    resultContainer.className = 'prediction-container';
    resultContainer.innerHTML = `
      <h3>📈 ${coinName} 투자 예측 결과</h3>
      <div class="result-summary">
        <p><strong>${periodDays}일 후 예상 결과:</strong></p>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">초기 투자금</span>
            <span class="result-value">$${initialInvestment.toLocaleString()}</span>
          </div>
          <div class="result-item">
            <span class="result-label">예상 자산 가치</span>
            <span class="result-value highlight-value">$${finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="result-item">
            <span class="result-label">예상 수익/손실</span>
            <span class="result-value ${profitOrLoss >= 0 ? 'profit' : 'loss'}">
              $${profitOrLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">예상 수익률</span>
            <span class="result-value ${returnRate >= 0 ? 'profit' : 'loss'}">
              ${returnRate.toFixed(2)}%
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">${coinSymbol} 시작 시점 가격</span>
            <span class="result-value">$${initialPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
          </div>
           <div class="result-item">
            <span class="result-label">${coinSymbol} ${periodDays}일 후 예상 가격</span>
            <span class="result-value">$${futurePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
          </div>
        </div>
      </div>
      <div class="disclaimer">
        <p>이 예측은 과거 데이터와 단순 변동성 모델을 기반으로 한 추정치이며, 실제 투자 수익을 보장하지 않습니다. 모든 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.</p>
      </div>`;
    pageElements.resultsArea.appendChild(resultContainer);
  } else { // 로딩 중도 아니고, 결과도 없는 초기 상태
    pageElements.resultsArea.innerHTML = `
      <div class="initial-info-container">
        <div class="initial-info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64px" height="64px">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
            <path d="M16.293 9.293 14.5 11.086l-2.293-2.293-3.207 3.207 1.414 1.414L12.5 11.336l2.293 2.293 2.5-2.5.707.707-3.207 3.207-1.414-1.414L14.5 12.707l-2.293-2.293-1.793 1.793-1.414-1.414 3.207-3.207L14.5 9.086l1.793-1.793zM7.5 14.086l1.793-1.793 1.414 1.414-1.793 1.793-1.414-1.414z"/>
          </svg>
        </div>
        <h3>투자를 시작하기 전에 예측해보세요!</h3>
        <p>선택한 코인, 투자금액, 기간을 입력하고 '예측 시작하기' 버튼을 누르면<br/>예상 수익률과 미래 가치를 확인할 수 있습니다.</p>
        <small>본 시뮬레이션은 과거 데이터를 기반으로 하며, 실제 투자 결과와 다를 수 있습니다. 투자 결정은 신중하게 하시기 바랍니다.</small>
      </div>`;
  }
}

// --- 이벤트 핸들러 및 로직 ---
async function handleSimulation() {
  if (!appState.selectedCoinId || !appState.investmentAmount || !appState.investmentPeriod) {
    appState.error = '모든 필드를 입력해주세요.';
    updateErrorMessage();
    return;
  }
  if (appState.investmentAmount <= 0) {
    appState.error = '투자 금액은 0보다 커야 합니다.';
    updateErrorMessage();
    return;
  }
  if (appState.investmentPeriod <= 0) {
    appState.error = '투자 기간은 0보다 커야 합니다.';
    updateErrorMessage();
    return;
  }

  appState.isLoading = true;
  appState.error = '';
  appState.simulationResult = null;

  updateFormInputsState();
  updateErrorMessage();
  updateResultsArea(); // 로딩 상태 표시

  try {
    const historicalData = await fetchHistoricalData(appState.selectedCoinId, appState.investmentPeriod);
    if (historicalData.length < 2) {
      throw new Error('수익률 계산에 충분한 데이터가 없습니다.');
    }

    const initialPrice = historicalData[0];
    const finalPrice = historicalData[historicalData.length - 1];
    const coin = appState.coins.find(c => c.id === appState.selectedCoinId);
    const coinSymbol = coin ? coin.symbol : appState.selectedCoinId.toUpperCase();
    const coinName = coin ? coin.name : appState.selectedCoinId;

    const profitOrLoss = (appState.investmentAmount / initialPrice * finalPrice) - appState.investmentAmount;
    const returnRate = (profitOrLoss / appState.investmentAmount) * 100;
    const futurePrice = finalPrice * (1 + (Math.random() - 0.45) * 0.2); // 임의 변동성

    appState.simulationResult = {
      coinName,
      coinSymbol,
      initialInvestment: parseFloat(appState.investmentAmount),
      finalValue: parseFloat(appState.investmentAmount) + profitOrLoss,
      profitOrLoss,
      returnRate,
      periodDays: parseInt(appState.investmentPeriod, 10),
      futurePrice,
      initialPrice,
    };
  } catch (err) {
    appState.error = '시뮬레이션 중 오류가 발생했습니다: ' + err.message;
    console.error(err);
  } finally {
    appState.isLoading = false;
    updateFormInputsState();
    updateErrorMessage();
    updateResultsArea(); // 결과 또는 초기 메시지 표시
  }
}

// --- 페이지 초기화 ---
async function initializePage(urlCoinSymbolParam) {
  // 상태 초기화
  appState = {
    coins: [],
    selectedCoinId: urlCoinSymbolParam || '', // URL 파라미터로 초기 코인 설정 시도
    investmentAmount: 1000,
    investmentPeriod: 30,
    simulationResult: null,
    isLoading: true, // 초기 코인 목록 로딩
    error: '',
  };

  updateFormInputsState(); // 입력 필드 초기 상태 (로딩 중이므로 비활성화)
  updateResultsArea();     // 초기 로딩 메시지 또는 안내

  try {
    const coinListFromAPI = await fetchCoinList();
    appState.coins = coinListFromAPI;

    // URL 파라미터로 전달된 코인이 유효한지 확인하고 selectedCoinId 설정
    if (urlCoinSymbolParam) {
        const foundCoin = appState.coins.find(c => c.symbol === urlCoinSymbolParam || c.id === urlCoinSymbolParam);
        if (foundCoin) {
            appState.selectedCoinId = foundCoin.id;
        } else if (appState.coins.length > 0) { // URL 코인이 없으면 첫번째 코인
            appState.selectedCoinId = appState.coins[0].id;
        }
    } else if (appState.coins.length > 0) { // URL 파라미터 없고 코인 목록 있으면 첫번째 코인
        appState.selectedCoinId = appState.coins[0].id;
    }
    
    populateCoinSelect(); // 코인 목록으로 <select> 채우기
    
  } catch (err) {
    appState.error = '코인 목록을 불러오는 데 실패했습니다.';
    console.error(err);
    updateErrorMessage();
  } finally {
    appState.isLoading = false;
    updateFormInputsState(); // 입력 필드 활성화 및 값 설정
    updateResultsArea();     // 초기 안내 메시지 표시 (로딩 완료)
  }
}

// --- 라우터에서 호출할 메인 함수 ---
export function renderInvestmentSimulationPage(appContainer, param) {
  createPageLayout(appContainer);
  initializePage(param); // param은 URL에서 전달된 코인 심볼일 수 있음
}
