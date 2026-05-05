import React from 'react';

const navItems = [
  { icon: '🏠', label: 'Home', active: true },
  { icon: '💬', label: 'Chatbot' },
  { icon: '📚', label: 'Courses' },
  { icon: '📊', label: 'Analytics' },
  { icon: '👨‍⚕️', label: 'Experts' },
  { icon: '📅', label: 'My Booking' },
  { icon: '📝', label: 'Session Summ...' },
  { icon: '📄', label: 'My Reports' },
  { icon: '⭐', label: 'My Review' },
  { icon: '💳', label: 'Transaction Hi...' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-content">
          <div className="sidebar-logo-icon">🌿</div>
          <span className="sidebar-logo-text">Jaydii</span>
        </div>
        <button className="sidebar-close-btn" onClick={onClose}>✕</button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) => (
          <div key={i} className={`nav-item ${item.active ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
