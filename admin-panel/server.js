const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");
const iconv = require("iconv-lite"); // 인코딩 변환

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
  res.json({ output: `✅ 디렉토리를 기본 위치로 초기화: ${currentDir}` });
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
      return res.json({ output: `📁 디렉토리 이동: ${currentDir}` });
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

app.listen(PORT, () => {
  console.log(`✅ CMD 서버 실행 중! http://localhost:${PORT}`);
});
