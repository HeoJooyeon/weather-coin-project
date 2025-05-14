import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", nickname: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/users?page=${page}&limit=${limit}`
      );
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("회원 목록 불러오기 실패", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/users/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5001/users", form);
      }
      setForm({ username: "", nickname: "", email: "" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("저장 실패", err);
    }
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      nickname: user.nickname,
      email: user.email,
    });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const handlePasswordReset = (id) => {
    console.log("비밀번호 초기화 실행 예정, 사용자 ID:", id);
    // TODO: 비밀번호 초기화 기능 구현 예정
  };

  return (
    <div>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>비밀번호 초기화</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handlePasswordReset(user.id)}>
                  초기화
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(user)}>수정</button>
                <button onClick={() => handleDelete(user.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => setPage(idx + 1)}
            style={{
              marginRight: "5px",
              fontWeight: page === idx + 1 ? "bold" : "normal",
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <br />
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="아이디"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <input
          placeholder="이메일"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">{editingId ? "수정" : "추가"}</button>
      </form>
    </div>
  );
}
