import React from 'react';

export default function DailyCheckin({ designVariant }) {
  return (
    <div className={`checkin-banner variant-${designVariant}`}>
      <div className="checkin-icon">＋</div>
      <div className="checkin-text">
        <h2>Daily Check-in reminder</h2>
        <p>Small steps help build emotional clarity</p>
      </div>
    </div>
  );
}
