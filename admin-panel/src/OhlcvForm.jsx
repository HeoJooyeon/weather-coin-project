import React, { useState } from "react";
import axios from "axios";

const PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "XRPUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "TRXUSDT",
  "SHIBUSDT",
  "LTCUSDT",
];

function OhlcvForm() {
  const [pair, setPair] = useState("BTCUSDT");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchOHLCV = async (pairList) => {
    setLoading(true);
    setMessage("");

    try {
      for (const p of pairList) {
        await axios.post("http://localhost:5001/api/fetch-ohlcv", {
          pair: p,
          startDate,
          endDate,
        });
      }
      setMessage("모든 코인 데이터 요청 성공");
    } catch (error) {
      setMessage(
        "요청 실패: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOHLCV([pair]);
  };

  const handleFetchAll = () => {
    if (!startDate || !endDate) {
      setMessage("시작일자와 종료일자를 먼저 입력하세요.");
      return;
    }
    fetchOHLCV(PAIRS);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Pair (예: BTCUSDT)</label>
        <input
          type="text"
          value={pair}
          onChange={(e) => setPair(e.target.value)}
        />
      </div>
      <div>
        <label>시작일자</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>종료일자</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "요청 중..." : "단일 코인 불러오기"}
      </button>
      <button type="button" onClick={handleFetchAll} disabled={loading}>
        {loading ? "요청 중..." : "모든 코인 가져오기"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default OhlcvForm;
