// components/store.js
// 테마 설정을 가져오는 헬퍼 함수
const getThemePreference = () => localStorage.getItem("theme") === "dark";

// 테마 아이콘을 업데이트하는 함수 (수정됨: localStorage에서 직접 테마 상태 확인)
function updateThemeIcon() {
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const isDark = getThemePreference(); // 현재 테마 설정을 가져옴
    themeToggle.textContent = isDark ? "☀️" : "🌙"; // 아이콘 설정
  }
}

// 테마를 토글하는 함수 (수정됨)
export function toggleTheme() {
  const body = document.body;
  // 현재 상태를 기준으로 다음 상태 결정
  const newIsDark = !body.classList.contains("dark-mode");

  body.classList.toggle("dark-mode", newIsDark); // body 클래스 명시적으로 설정
  localStorage.setItem("theme", newIsDark ? "dark" : "light"); // localStorage 업데이트

  // 다른 컴포넌트 알림용 커스텀 이벤트 (필요한 경우 detail에 상태 전달)
  const themeChangeEvent = new CustomEvent("themeUpdate", {
    bubbles: true,
    composed: true,
    detail: { isDark: newIsDark },
  });
  document.dispatchEvent(themeChangeEvent);

  updateThemeIcon(); // 아이콘 즉시 업데이트
}

// 페이지 로드 또는 변경 시 테마를 적용하는 함수
export function applyTheme() {
  const isDarkMode = getThemePreference();
  document.body.classList.toggle("dark-mode", isDarkMode);
  updateThemeIcon(); // 테마 적용 시 아이콘도 업데이트
}

// 네비게이션 바 설정 함수
export function setupNavbar() {
  const navbar = document.createElement("nav");
  navbar.className = "navbar";

  const container = document.createElement("div");
  container.className = "container";

  // 로고 요소 생성
  const logo = document.createElement("div"); // div 태그 생성
  logo.className = "logo"; // CSS 클래스 부여
  logo.textContent = "⛅ 매수하기 딱 좋은 날씨네!?"; // 텍스트 + 이모지 추가
  logo.addEventListener("click", () => {
    window.location.hash = "";
  });

  // 네비게이션 링크
  const navLinks = document.createElement("div");
  navLinks.className = "nav-links";
  ["메인", "수익률 예측", "종목토론"].forEach((text, index) => {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = `#${["main", "prediction", "discussion"][index]}`;
    navLinks.appendChild(a);
  });

  const searchBox = document.createElement("div");
  searchBox.className = "search-login";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  const searchActionBtn = document.createElement("button");
  searchActionBtn.textContent = "검색";

  // **검색 자동완성 드롭다운**
  const dropdown = document.createElement("ul");
  dropdown.className = "search-dropdown";
  Object.assign(dropdown.style, {
    position: "absolute",
    top: "100%",
    margin: "0",
    padding: "0",
    listStyle: "none",
    background: "var(--card-bg-color)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    maxHeight: "240px",
    overflowY: "auto",
    display: "none",
    zIndex: "1001",
  });
  // **드롭다운 내용 갱신 함수**
  // 기존 updateDropdown 블록 대신 이 전체를 넣으세요
  function updateDropdown() {
    const q = searchInput.value.trim().toLowerCase();
    dropdown.innerHTML = "";

    const COIN_LIST = [
      {
        rank: 1,
        name: "비트코인",
        symbol: "BTC",
        graphicSymbol: "₿", // 비트코인 그래픽 심볼
        apiSymbol: "BTCUSDT",
        price: "$67,890.45",
        change: "+2.34%",
      },
      {
        rank: 2,
        name: "이더리움",
        symbol: "ETH",
        graphicSymbol: "Ξ", // 이더리움 그래픽 심볼
        apiSymbol: "ETHUSDT",
        price: "$3,456.78",
        change: "+1.23%",
      },
      {
        rank: 3,
        name: "리플",
        symbol: "XRP",
        graphicSymbol: "✕", // 리플 그래픽 심볼 (일반적으로 사용되는 X)
        apiSymbol: "XRPUSDT",
        price: "$1.23",
        change: "-0.45%",
      },
      {
        rank: 4,
        name: "바이낸스코인",
        symbol: "BNB",
        graphicSymbol: "BNB", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
        apiSymbol: "BNBUSDT",
        price: "$456.78",
        change: "+0.89%",
      },
      {
        rank: 5,
        name: "솔라나",
        symbol: "SOL",
        graphicSymbol: "SOL", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
        apiSymbol: "SOLUSDT",
        price: "$123.45",
        change: "+5.67%",
      },
      {
        rank: 6,
        name: "도지코인",
        symbol: "DOGE",
        graphicSymbol: "Ɖ", // 도지코인 그래픽 심볼
        apiSymbol: "DOGEUSDT",
        price: "$0.123",
        change: "-1.23%",
      },
      {
        rank: 7,
        name: "카르다노",
        symbol: "ADA",
        graphicSymbol: "₳", // 카르다노 그래픽 심볼
        apiSymbol: "ADAUSDT",
        price: "$0.456",
        change: "+0.78%",
      },
      {
        rank: 8,
        name: "트론",
        symbol: "TRX",
        graphicSymbol: "TRX", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
        apiSymbol: "TRXUSDT",
        price: "$0.089",
        change: "-0.34%",
      },
      {
        rank: 9,
        name: "시바이누",
        symbol: "SHIB",
        graphicSymbol: "SHIB", // 그래픽 심볼 없는 경우 텍스트 심볼 사용
        apiSymbol: "SHIBUSDT",
        price: "$0.00002345",
        change: "+3.45%",
      },
      {
        rank: 10,
        name: "라이트코인",
        symbol: "LTC",
        graphicSymbol: "Ł", // 라이트코인 그래픽 심볼
        apiSymbol: "LTCUSDT",
        price: "$78.90",
        change: "-0.67%",
      },
    ];

    // 쿼리가 없으면 전체, 있으면 필터된 리스트
    const listToShow = q
      ? COIN_LIST.filter(
          (coin) =>
            coin.name.toLowerCase().includes(q) ||
            coin.symbol.toLowerCase().includes(q)
        )
      : COIN_LIST;

    // 표시할 항목이 없으면 숨기기
    if (listToShow.length === 0) {
      dropdown.style.display = "none";
      return;
    }

    // 목록 렌더링
    listToShow.forEach((coin) => {
      const li = document.createElement("li");
      li.className = "dropdown-item";
      Object.assign(li.style, {
        padding: "8px 12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      });
      // 아이콘
      const ico = document.createElement("span");
      ico.textContent = coin.graphicSymbol || coin.symbol;
      ico.style.marginRight = "8px";
      // 텍스트
      const txt = document.createElement("span");
      txt.textContent = `${coin.name} (${coin.symbol})`;
      li.append(ico, txt);

      // 호버 스타일
      li.addEventListener(
        "mouseenter",
        () => (li.style.background = "var(--input-bg-color)")
      );
      li.addEventListener(
        "mouseleave",
        () => (li.style.background = "transparent")
      );

      // 클릭 시 상세 페이지로 이동
      li.addEventListener("click", () => {
        window.location.hash = `#/coin/${coin.symbol}`;
        dropdown.style.display = "none";
        searchInput.value = "";
      });

      dropdown.appendChild(li);
    });
    dropdown.style.width = `${searchInput.offsetWidth}px`;
    dropdown.style.left = `${searchInput.offsetLeft}px`;
    dropdown.style.display = "block";
  }

  searchInput.addEventListener("input", updateDropdown);
  searchInput.addEventListener("focus", updateDropdown);
  searchActionBtn.addEventListener("click", updateDropdown);
  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target)) dropdown.style.display = "none";
  });

  searchBox.append(searchInput, searchActionBtn, dropdown);

  const themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.addEventListener("click", toggleTheme);

  // 로그인 상태를 확인하는 함수
  function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  const loginBtn = document.createElement("button");
  loginBtn.textContent = isLoggedIn() ? "로그아웃" : "로그인"; // 로그인 상태에 따라 텍스트 변경
  loginBtn.id = "navbar-login-button";
  loginBtn.addEventListener("click", () => {
    if (isLoggedIn()) {
      // 로그아웃 로직
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("id");
      localStorage.removeItem("user");
      window.location.hash = ""; // 메인 페이지로 리디렉션 또는 다른 페이지로 변경
    } else {
      // 로그인 페이지로 이동
      window.location.hash = "login";
    }
    window.updateLoginButtonText(); // 버튼 텍스트 업데이트
  });

  // 로그인 버튼 텍스트 업데이트 함수
  // 전역 객체에 바인딩하여 모듈 외부에서도 접근 가능하게 함
  window.updateLoginButtonText = function () {
    const loginBtn = document.getElementById("navbar-login-button");
    if (loginBtn) {
      loginBtn.textContent = isLoggedIn() ? "로그아웃" : "로그인";
    }
  };

  searchBox.append(searchInput, searchActionBtn, themeToggle, loginBtn);
  container.append(logo, navLinks, searchBox);
  navbar.appendChild(container);
  document.body.insertBefore(navbar, document.body.firstChild);

  applyTheme();
}
