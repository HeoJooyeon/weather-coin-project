// app/router.js
import { applyTheme } from "../components/store.js";
import { renderMainPage } from "../pages/MainPage.js";
import { renderCoinDetailPage } from "../pages/CoinDetail.js";
import { renderInvestmentSimulationPage } from "../pages/InvestmentSimulation.js"; // InvestmentSimulation.js 임포트 추가 (실제 export 방식에 따라 수정 필요)
import { renderDiscussionPage } from "../pages/Discussion.js";
import { renderPostDetailPage } from "../pages/PostDetail.js";
import { renderLoginPage } from "../pages/Login.js";
import { renderSignupPage } from "../pages/Signup.js"; // 추가

export function initRouter() {
  updateRoute();
  window.addEventListener("hashchange", updateRoute);
}

export function updateRoute() {
  const container = document.getElementById("app");
  let hash = window.location.hash.substring(1) || "";

  if (hash.startsWith("/")) {
    hash = hash.substring(1);
  }

  const [path, param] = hash.split("/");
  console.log("현재 경로:", path, "파라미터:", param);

  // applyTheme(); // 페이지 변경 시 테마 적용 (필요시 주석 해제)

  switch (path) {
    case "":
    case "main":
      renderMainPage(container);
      break;

    case "prediction":
      renderInvestmentSimulationPage(container, param); // 이렇게 변경
      break;
    case "discussion":
      renderDiscussionPage(container, param);
      break;
    case "coin":
      renderCoinDetailPage(container, param);
      break;
    case "post":
      renderPostDetailPage(container, param);
      break;
    case "login":
      renderLoginPage(container);
      break;
    case "signup": // 새로운 경로 추가
      renderSignupPage(container);
      break;
    default:
      console.warn(`알 수 없는 경로: ${path}`);
      renderMainPage(container);
  }
}
