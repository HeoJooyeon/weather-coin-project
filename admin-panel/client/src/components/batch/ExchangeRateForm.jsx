import React, { useState } from "react";
import axios from "axios";

function ExchangeRateForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5001/api/exchange-rate", {
        startDate,
        endDate,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("요청 실패: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>시작일자 : </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>종료일자 : </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "불러오는 중..." : "불러오기"}
      </button>
      <p>{message}</p>
    </form>
  );
}

export default ExchangeRateForm;
