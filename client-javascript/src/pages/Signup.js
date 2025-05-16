// src/pages/Signup.js

// 로그인 페이지의 Caps Lock 경고 함수를 가져오거나 유사하게 구현할 수 있습니다.
// function handleCapsLock(event) { ... }

export function renderSignupPage(container) {
  container.innerHTML = ""; // 이전 내용 지우기

  const signupPageWrapper = document.createElement("div");
  signupPageWrapper.className = "login-page-wrapper"; // 로그인 페이지와 유사한 스타일 적용

  const signupFormContainer = document.createElement("div");
  signupFormContainer.className = "login-form-container"; // 로그인 페이지와 유사한 스타일 적용

  const formTitle = document.createElement("h2");
  formTitle.className = "login-form-title"; // 로그인 페이지와 유사한 스타일 적용
  formTitle.textContent = "회원가입";

  const formDescription = document.createElement("p");
  formDescription.className = "login-form-description"; // 로그인 페이지와 유사한 스타일 적용
  formDescription.textContent = "새로운 계정을 만들어 서비스를 이용하세요.";

  const form = document.createElement("form");
  form.id = "signupForm";
  form.addEventListener("submit", handleSignupSubmit);

  // 사용자 이름 입력 필드
  const usernameGroup = document.createElement("div");
  usernameGroup.className = "form-group";
  const usernameLabel = document.createElement("label");
  usernameLabel.htmlFor = "username";
  usernameLabel.textContent = "사용자 이름";
  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.name = "username";
  usernameInput.placeholder = "사용하실 이름을 입력하세요";
  usernameInput.required = true;
  usernameGroup.appendChild(usernameLabel);
  usernameGroup.appendChild(usernameInput);

  // 이메일(사용자 ID) 입력 필드
  const emailGroup = document.createElement("div");
  emailGroup.className = "form-group";
  const emailLabel = document.createElement("label");
  emailLabel.htmlFor = "email"; // API의 userId에 해당
  emailLabel.textContent = "이메일 주소 (로그인 ID)";
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
  // passwordInput.addEventListener("keyup", handleCapsLock); // 필요시 CapsLock 핸들러 연결
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  // 비밀번호 확인 입력 필드
  const passwordConfirmGroup = document.createElement("div");
  passwordConfirmGroup.className = "form-group";
  const passwordConfirmLabel = document.createElement("label");
  passwordConfirmLabel.htmlFor = "password-confirm";
  passwordConfirmLabel.textContent = "비밀번호 확인";
  const passwordConfirmInput = document.createElement("input");
  passwordConfirmInput.type = "password";
  passwordConfirmInput.id = "password-confirm";
  passwordConfirmInput.name = "password-confirm";
  passwordConfirmInput.placeholder = "••••••••";
  passwordConfirmInput.required = true;
  passwordConfirmGroup.appendChild(passwordConfirmLabel);
  passwordConfirmGroup.appendChild(passwordConfirmInput);

  // (선택) Caps Lock 알림 (Login.js의 capsLockWarning 요소와 handleCapsLock 함수 참조)

  // 회원가입 버튼
  const signupButton = document.createElement("button");
  signupButton.type = "submit";
  signupButton.className = "login-button primary"; // 로그인 버튼과 유사한 스타일 적용
  signupButton.textContent = "가입하기";

  // 로그인 페이지로 이동 링크
  const loginPrompt = document.createElement("div");
  loginPrompt.className = "signup-prompt"; // 로그인 페이지의 signup-prompt와 유사한 스타일 적용
  loginPrompt.innerHTML = `이미 계정이 있으신가요? <a href="#/login">로그인</a>`;

  // 폼 요소들 추가
  form.appendChild(usernameGroup);
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(passwordConfirmGroup);
  form.appendChild(signupButton);

  signupFormContainer.appendChild(formTitle);
  signupFormContainer.appendChild(formDescription);
  signupFormContainer.appendChild(form);
  signupFormContainer.appendChild(loginPrompt);

  signupPageWrapper.appendChild(signupFormContainer);
  container.appendChild(signupPageWrapper);
}

async function handleSignupSubmit(event) {
  event.preventDefault();
  const username = event.target.username.value;
  const userId = event.target.email.value; // API의 userId는 이메일
  const password = event.target.password.value;
  const passwordConfirm = event.target["password-confirm"].value;

  // 클라이언트 측 유효성 검사
  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  if (password.length < 4) {
    // API의 유효성 검사와 일치시킴 (authController.js 참조)
    alert("비밀번호는 4자 이상이어야 합니다.");
    return;
  }
  // 추가적인 유효성 검사 (예: 이메일 형식)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userId)) {
    alert("올바른 이메일 형식을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: userId,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      window.location.hash = "#login"; // 회원가입 성공 시 로그인 페이지로 이동
    } else {
      alert(data.message || "회원가입에 실패했습니다.");
    }
  } catch (error) {
    console.error("회원가입 API 호출 오류:", error);
    alert("네트워크 오류 또는 서버에 연결할 수 없습니다.");
  }
}

// Caps Lock 감지 함수 (필요한 경우 Login.js에서 가져오거나 여기에 구현)
/*
function handleCapsLock(event) {
  const capsLockWarning = document.getElementById("capsLockWarning"); // Signup.js에도 이 ID를 가진 요소 필요
  if (capsLockWarning) {
    if (event.getModifierState && event.getModifierState("CapsLock")) {
      capsLockWarning.style.display = "block";
    } else {
      capsLockWarning.style.display = "none";
    }
  }
}
*/
