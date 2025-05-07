import React from "react";
import CommandPanel from "./CommandPanel";
import OhlcvForm from "./OhlcvForm";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>OhlcvForm 배치</h2>
      <OhlcvForm />
      <h2>관리자 CMD 실행기</h2>
      <CommandPanel />
    </div>
  );
}
