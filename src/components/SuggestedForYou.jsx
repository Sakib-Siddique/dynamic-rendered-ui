import React from 'react';

export default function SuggestedForYou({ designVariant }) {
  return (
    <div className={`suggested-banner variant-${designVariant}`}>
      <div className="suggested-icon">💡</div>
      <div className="suggested-text">
        <h3>Suggested for you</h3>
        <p>A short breathing exercise could help today</p>
        <span className="try-link">Try now</span>
      </div>
    </div>
  );
}
