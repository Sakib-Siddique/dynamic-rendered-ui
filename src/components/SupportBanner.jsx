import React from 'react';

export default function SupportBanner({ designVariant }) {
  return (
    <div className={`support-banner variant-${designVariant}`}>
      <div className="support-icon">🛡️</div>
      <div className="support-text">
        <h3>You're not alone</h3>
        <p>Support is always available when you need it</p>
      </div>
    </div>
  );
}
