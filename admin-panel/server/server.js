require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");
const iconv = require("iconv-lite"); // 인코딩 변환
const { fetchAndStoreOHLCV } = require("./api/binanceService");
const { fetchAndStoreGoldPrices } = require("./api/gold");
const { fetchAndStoreExchangeRates } = require("./api/exchangeRate");
const pool = require("./db/db");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

let baseDir = process.cwd(); // 최초 디렉토리 기억
let currentDir = baseDir; // 현재 작업 디렉토리 유지

// OS에 따라 쉘 설정
const shell = os.platform() === "win32" ? "cmd.exe" : "/bin/bash";

// 기본 디렉토리로 초기화
app.post("/reset-dir", (req, res) => {
  currentDir = baseDir;
  res.json({ output: `디렉토리를 기본 위치로 초기화: ${currentDir}` });
});

app.post("/run", (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: "명령어가 없습니다." });
  }

  // 디렉토리 변경 처리
  if (command.startsWith("cd ")) {
    const target = command.replace("cd ", "").trim();
    try {
      const newPath = path.resolve(currentDir, target);
      currentDir = newPath;
      return res.json({ output: `디렉토리 이동: ${currentDir}` });
    } catch (e) {
      return res.status(400).json({ error: `경로 이동 실패: ${e.message}` });
    }
  }

  // 일반 명령 실행 (인코딩 + chcp + buffer 처리)
  const fullCommand =
    os.platform() === "win32" ? `chcp 65001 > nul && ${command}` : command;

  exec(
    fullCommand,
    { cwd: currentDir, shell, encoding: "buffer" },
    (err, stdout, stderr) => {
      const output = iconv.decode(stdout, "utf-8");
      const error = iconv.decode(stderr, "utf-8");

      if (err) {
        return res.status(500).json({ error: error || err.message });
      }
      res.json({ output });
    }
  );
});

app.post("/api/fetch-ohlcv", async (req, res) => {
  const { pair, startDate, endDate } = req.body;

  try {
    await fetchAndStoreOHLCV(pair, startDate, endDate);
    res.json({
      success: true,
      message: `${pair}의 데이터를 ${startDate}~${endDate}까지 저장했습니다.`,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching or storing data." });
  }
});

app.post("/api/fetch-gold", async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "시작일자와 종료일자를 입력하세요." });
  }

  try {
    const count = await fetchAndStoreGoldPrices(startDate, endDate);
    res.json({ message: `총 ${count}건 저장 완료` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오류 발생", error: err.message });
  }
});

app.post("/api/exchange-rate", async (req, res) => {
  const { startDate, endDate } = req.body;
  try {
    const count = await fetchAndStoreExchangeRates(startDate, endDate);
    res.json({ message: `${count}개의 환율 데이터가 저장되었습니다.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "데이터 수집 중 오류 발생" });
  }
});

// 전체 코인 목록 조회
app.get("/coins", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM coin_master WHERE deleted_yn = 'N' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB 조회 실패" });
  }
});

// 코인 추가
app.post("/coins", async (req, res) => {
  const { name, symbol, pair, logo_url } = req.body;
  try {
    await pool.query(
      "INSERT INTO coin_master (name, symbol, pair, logo_url) VALUES (?, ?, ?, ?)",
      [name, symbol, pair, logo_url]
    );
    res.json({ message: "등록 성공" });
  } catch (err) {
    res.status(500).json({ error: "등록 실패" });
  }
});

// 코인 수정
app.put("/coins/:id", async (req, res) => {
  const { id } = req.params;
  const { name, symbol, pair, logo_url } = req.body;
  try {
    await pool.query(
      "UPDATE coin_master SET name=?, symbol=?, pair=?, logo_url=? WHERE id=?",
      [name, symbol, pair, logo_url, id]
    );
    res.json({ message: "수정 성공" });
  } catch (err) {
    res.status(500).json({ error: "수정 실패" });
  }
});

// 논리 삭제
app.delete("/coins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE coin_master SET deleted_yn='Y', deleted_at=NOW() WHERE id=?",
      [id]
    );
    res.json({ message: "삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

// 전체 사용자 조회
app.get("/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const [data] = await pool.query(
      "SELECT * FROM users WHERE deleted_yn = 'N' ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE deleted_yn = 'N'"
    );
    res.json({ data, total });
  } catch (err) {
    res.status(500).json({ error: "DB 조회 실패" });
  }
});

// 사용자 추가
app.post("/users", async (req, res) => {
  const { username, nickname, email } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (username, password, nickname, email) VALUES (?, ?, ?, ?)",
      [username, "", nickname, email] // 비밀번호는 초기화 로직으로 대체 예정
    );
    res.json({ message: "등록 성공" });
  } catch (err) {
    res.status(500).json({ error: "등록 실패" });
  }
});

// 사용자 수정
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, nickname, email } = req.body;
  try {
    await pool.query(
      "UPDATE users SET username=?, nickname=?, email=? WHERE id=?",
      [username, nickname, email, id]
    );
    res.json({ message: "수정 성공" });
  } catch (err) {
    res.status(500).json({ error: "수정 실패" });
  }
});

// 논리 삭제
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE users SET deleted_yn='Y', deleted_at=NOW() WHERE id=?",
      [id]
    );
    res.json({ message: "삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
