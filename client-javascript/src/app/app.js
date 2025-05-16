import { initRouter } from "./router.js";
import { setupNavbar } from "../components/store.js";

// DOM 로드 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
  initRouter();
});
