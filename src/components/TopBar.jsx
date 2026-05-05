import React from 'react';

export default function TopBar({ onToggleSidebar }) {
  return (
    <div className="topbar">
      <button className="hamburger-btn" onClick={onToggleSidebar}>
        ☰
      </button>
      
      <div className="topbar-right">
        <div className="topbar-notification">
          🔔
          <span className="notif-badge" />
        </div>
        <div className="topbar-user">
          <span className="topbar-user-name">Test</span>
          <span className="topbar-user-chevron">▾</span>
          <div className="topbar-avatar">👤</div>
        </div>
      </div>
    </div>
  );
}
