import React, { useState } from "react";
import axios from "axios";

function GoldForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5001/api/fetch-gold", {
        startDate,
        endDate,
      });

      setMessage(res.data.message || "데이터 요청 완료");
    } catch (err) {
      setMessage("요청 실패: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        {loading ? "불러오는 중..." : "금 시세 불러오기"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default GoldForm;
