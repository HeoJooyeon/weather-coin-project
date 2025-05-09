import React from "react";
import CommandPanel from "../components/admin/CommandPanel";
import OhlcvForm from "../components/batch/OhlcvForm";
import GoldForm from "../components/batch/GoldForm";
import ExchangeRateForm from "../components/batch/ExchangeRateForm";
import CoinManager from "../components/admin/CoinManager";
import UserManager from "../components/admin/UserManager";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>1. 기간별 데이터 수집 (OHLCV / 금 시세 / 환율)</h2>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h3>환율</h3>
          <ExchangeRateForm />
        </div>
        <div style={{ flex: 1 }}>
          <h3>금 시세</h3>
          <GoldForm />
        </div>
        <div style={{ flex: 1 }}>
          <h3>OHLCV</h3>
          <OhlcvForm />
        </div>
      </div>
      <h2>2. 코인마스터 정보 관리</h2>
      <CoinManager />
      <h2>3. 유저 정보 관리</h2>
      <UserManager />
      <h2>4. 관리자 명령어 실행기</h2>
      <CommandPanel />
    </div>
  );
}
