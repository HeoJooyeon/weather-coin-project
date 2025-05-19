const User = require("../models/user");

exports.register = async (req, res) => {
  const { username, email, password, nickname } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "사용자 이름, 이메일, 비밀번호는 필수 항목입니다.",
    });
  }

  try {
    const existingUserByEmail = await User.findOne({
      where: { userId: email },
    });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    const newUser = await User.create({
      username,
      password,
      email,
      nickname,
    });

    res.status(201).json({
      success: true,
      message: "회원가입 성공",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        nickname: newUser.nickname,
      },
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({
      success: false,
      message: error.message || "회원가입 중 서버 오류가 발생했습니다.",
    });
  }
};

exports.login = async (req, res) => {
  console.log("------- LOGIN ATTEMPT -------"); // 로그인 시도 시작점 표시
  console.log("1. 수신된 req.body:", req.body); // 요청 본문 전체 출력
  const { userId, password } = req.body; // 여기서 userId는 사용자가 입력한 이메일

  if (!userId || !password) {
    console.log("2. 유효성 검사 실패: userId 또는 password 누락.");
    return res.status(400).json({
      success: false,
      message: "이메일과 비밀번호를 입력해주세요.",
    });
  }
  console.log(
    `3. 추출된 userId (이메일): '${userId}', password: '${password}'`,
  ); // 추출된 값 확인

  try {
    console.log(`4. User.findOne 호출 예정, 검색할 이메일: '${userId}'`);
    const user = await User.findOne({ where: { userId: userId } }); // userId는 이메일 값
    console.log("5. User.findOne 결과 (DB에서 가져온 user 객체):", user); // DB 조회 결과 확인

    if (!user) {
      console.log(
        `6. 사용자 없음: DB에서 '${userId}' 이메일을 가진 사용자를 찾지 못했습니다.`,
      );
      return res.status(400).json({
        success: false,
        message: "이메일 또는 비밀번호가 잘못되었습니다.",
      });
    }

    // 7. 사용자 찾음. 비밀번호 비교 시작
    console.log("7. 사용자 찾음. 비밀번호 비교 시작.");
    console.log(
      `   - DB에 저장된 비밀번호 (user.password): '${user.password}' (타입: ${typeof user.password})`,
    );
    console.log(
      `   - 입력된 비밀번호 (password): '${password}' (타입: ${typeof password})`,
    );

    // 중요: user 객체에 password 속성이 실제로 있는지,
    // 그리고 그 값이 DB에 저장된 평문 비밀번호인지 확인해야 합니다.
    // 이전 User 모델의 formatUser는 password를 반환하지 않았습니다.
    // 만약 User.findOne이 formatUser를 거쳐온다면 user.password는 undefined일 수 있습니다.

    if (user.password !== password) {
      console.log("8. 비밀번호 불일치.");
      return res.status(400).json({
        success: false,
        message: "이메일 또는 비밀번호가 잘못되었습니다.",
      });
    }

    console.log("9. 로그인 성공!");
    res.status(200).json({
      success: true,
      message: "로그인 성공",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error("로그인 오류 상세 정보:", error);
    return res.status(500).json({
      success: false,
      message: "로그인 중 서버 오류가 발생했습니다.",
    });
  }
};
