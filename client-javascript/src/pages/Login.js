// pages/Login.js
// 전역으로 window.updateLoginButtonText 함수를 사용하므로 별도의 import는 필요 없습니다.

export function renderLoginPage(container) {
  container.innerHTML = ""; // 이전 내용 지우기

  const loginPageWrapper = document.createElement("div");
  loginPageWrapper.className = "login-page-wrapper";

  const loginFormContainer = document.createElement("div");
  loginFormContainer.className = "login-form-container";

  const formTitle = document.createElement("h2");
  formTitle.className = "login-form-title";
  formTitle.textContent = "로그인";

  const formDescription = document.createElement("p");
  formDescription.className = "login-form-description";
  formDescription.textContent = "계정에 로그인하여 모든 기능을 이용하세요.";

  const form = document.createElement("form");
  form.id = "loginForm";
  form.addEventListener("submit", handleLoginSubmit);

  // 이메일 입력 필드
  const emailGroup = document.createElement("div");
  emailGroup.className = "form-group";
  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email";
  emailLabel.textContent = "이메일 주소";
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.placeholder = "you@example.com";
  emailInput.required = true;
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);

  // 비밀번호 입력 필드
  const passwordGroup = document.createElement("div");
  passwordGroup.className = "form-group";
  const passwordLabel = document.createElement("label");
  passwordLabel.htmlFor = "password";
  passwordLabel.textContent = "비밀번호";
  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.placeholder = "••••••••";
  passwordInput.required = true;
  passwordInput.addEventListener("keyup", handleCapsLock);
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  // Caps Lock 알림
  const capsLockWarning = document.createElement("div");
  capsLockWarning.id = "capsLockWarning";
  capsLockWarning.className = "caps-lock-warning";
  capsLockWarning.style.display = "none";
  capsLockWarning.textContent = "Caps Lock이 켜져 있습니다.";
  passwordGroup.appendChild(capsLockWarning);

  // 추가 옵션 (기억하기, 비밀번호 찾기)
  const extraOptions = document.createElement("div");
  extraOptions.className = "extra-options";
  const rememberMeLabel = document.createElement("label");
  rememberMeLabel.className = "remember-me";
  const rememberMeCheckbox = document.createElement("input");
  rememberMeCheckbox.type = "checkbox";
  rememberMeCheckbox.name = "remember";
  rememberMeLabel.appendChild(rememberMeCheckbox);
  rememberMeLabel.append(" 로그인 상태 유지");
  const forgotPasswordLink = document.createElement("a");
  forgotPasswordLink.href = "#/forgot-password";
  forgotPasswordLink.className = "forgot-password-link";
  forgotPasswordLink.textContent = "비밀번호를 잊으셨나요?";
  extraOptions.appendChild(rememberMeLabel);
  extraOptions.appendChild(forgotPasswordLink);

  // 로그인 버튼
  const loginButton = document.createElement("button");
  loginButton.type = "submit";
  loginButton.className = "login-button primary";
  loginButton.textContent = "로그인";

  // 회원가입 링크
  const signUpPrompt = document.createElement("div");
  signUpPrompt.className = "signup-prompt";
  signUpPrompt.innerHTML = `계정이 없으신가요? <a href="#/signup">회원가입</a>`;

  // 폼 요소들 추가
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(extraOptions);
  form.appendChild(loginButton);

  loginFormContainer.appendChild(formTitle);
  loginFormContainer.appendChild(formDescription);
  loginFormContainer.appendChild(form);
  loginFormContainer.appendChild(signUpPrompt);

  loginPageWrapper.appendChild(loginFormContainer);
  container.appendChild(loginPageWrapper);
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const userId = event.target.email.value; // 서버는 userId를 사용
  const password = event.target.password.value;
  const rememberMe = event.target.remember.checked;

  try {
    const response = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // 서버 응답에 맞게 사용자 정보 저장
      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      if (rememberMe) {
        // 로그인 상태 유지 처리
        localStorage.setItem("rememberLogin", "true");
      }

      // 로그인 버튼 텍스트를 즉시 업데이트 (전역 함수 호출)
      if (typeof window.updateLoginButtonText === "function") {
        window.updateLoginButtonText();
      }

      // 페이지 이동을 먼저 수행합니다.
      window.location.hash = "#main"; // 로그인 성공 시 메인 페이지로 이동

      // 그 다음에 alert 메시지를 표시합니다.
      alert("로그인 성공!");
    } else {
      // 서버 응답에 있는 실패 메시지 표시
      alert(data.message || "로그인에 실패했습니다.");
    }
  } catch (error) {
    console.error("로그인 API 호출 오류:", error);
    alert("네트워크 오류 또는 서버에 연결할 수 없습니다.");
  }
}

function handleCapsLock(event) {
  const capsLockWarning = document.getElementById("capsLockWarning");
  if (event.getModifierState && event.getModifierState("CapsLock")) {
    capsLockWarning.style.display = "block";
  } else {
    capsLockWarning.style.display = "none";
  }
}
