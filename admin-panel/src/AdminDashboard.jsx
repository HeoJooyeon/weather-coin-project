import React from 'react';
import CommandPanel from './CommandPanel';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🔧 관리자 CMD 실행기</h2>
      <CommandPanel />
    </div>
  );
}