import React, { useState } from "react";

export default function CommandPanel() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");

  const runCommand = async () => {
    if (!command.trim()) return;

    const res = await fetch("http://localhost:5001/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });

    const data = await res.json();
    setOutput(
      data.output || `❌ 오류:\n${data.error || "명령어 실행 결과가 없습니다."}`
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      runCommand();
    }
  };

  const resetDirectory = async () => {
    const res = await fetch("http://localhost:5001/reset-dir", {
      method: "POST",
    });

    const data = await res.json();
    setOutput(data.output || "📁 디렉토리를 초기화할 수 없습니다.");
  };

  return (
    <div>
      <input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="명령어를 입력하고 Enter를 누르세요 (예: dir, ls)"
        style={{ width: "70%", padding: "8px" }}
      />
      <button
        onClick={resetDirectory}
        style={{ marginLeft: "10px", padding: "8px" }}
      >
        🔄 기본 위치로 초기화
      </button>
      <pre
        style={{
          marginTop: "20px",
          background: "#111",
          color: "#0f0",
          padding: "15px",
          whiteSpace: "pre-wrap", // 줄바꿈 처리
          wordBreak: "break-all", // 긴 한글 단어 줄바꿈
          fontFamily: "monospace",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
