import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoinManager() {
  const [coins, setCoins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    pair: "",
    logo_url: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const res = await axios.get("http://localhost:5001/coins");
      setCoins(res.data);
    } catch (err) {
      console.error("코인 목록 불러오기 실패", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/coins/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5001/coins", form);
      }
      setForm({ name: "", symbol: "", pair: "", logo_url: "" });
      setEditingId(null);
      fetchCoins();
    } catch (err) {
      console.error("저장 실패", err);
    }
  };

  const handleEdit = (coin) => {
    setForm({
      name: coin.name,
      symbol: coin.symbol,
      pair: coin.pair,
      logo_url: coin.logo_url,
    });
    setEditingId(coin.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/coins/${id}`);
      fetchCoins();
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>심볼</th>
            <th>거래쌍</th>
            <th>로고</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.id}</td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>{coin.pair}</td>
              <td>
                {coin.logo_url ? (
                  <img src={coin.logo_url} alt={coin.symbol} width="32" />
                ) : (
                  "-"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(coin)}>수정</button>
                <button onClick={() => handleDelete(coin.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="심볼"
          value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })}
        />
        <input
          placeholder="거래쌍"
          value={form.pair}
          onChange={(e) => setForm({ ...form, pair: e.target.value })}
        />
        <input
          placeholder="로고 URL"
          value={form.logo_url}
          onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
        />
        <button type="submit">{editingId ? "수정" : "추가"}</button>
      </form>
    </div>
  );
}
