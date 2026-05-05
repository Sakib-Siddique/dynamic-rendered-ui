import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Elements = {
  Header: () => (
    <div className="wearable-header">
      <div className="wearable-header-left">
        <h3>Wearable Health Insights</h3>
        <div className="wearable-status">
          <span className="status-dot" />
          MOCK SMARTWATCH &amp; SYNCED
        </div>
      </div>
      <button className="wearable-sync-btn">🔄</button>
    </div>
  ),
  DeviceInfo: () => (
    <div className="device-info">
      <div className="device-icon-box">⌚</div>
      <h4>Device Connected</h4>
      <span className="device-model">MOCK SMARTWATCH</span>
      <p className="device-desc">Synced in real-time from the cloud.</p>
    </div>
  ),
  StepsTracker: () => (
    <div className="steps-card">
      <div className="steps-header">
        <div className="steps-header-left">🏃 Total Steps</div>
        <div><span className="steps-value">8,420</span> <span className="steps-goal">/10,000</span></div>
      </div>
      <div className="steps-bar"><div className="steps-bar-fill" style={{ width: '84%' }} /></div>
    </div>
  ),
  VitalsRow: () => (
    <div className="vital-row">
      <div className="vital-card">❤️ <div><div className="vital-label">HEART RATE</div><div className="vital-value">76 <span className="vital-unit">BPM</span></div></div></div>
      <div className="vital-card">😴 <div><div className="vital-label">SLEEP</div><div className="vital-value">7h 20m</div></div></div>
    </div>
  ),
  AITip: () => (
    <div className="ai-tip-bar">
      <div className="ai-tip-icon">AI</div>
      <span>PRO TIP: You're 1,580 steps away from your goal!</span>
    </div>
  )
};

export default function WearableInsights({ internalLayout }) {
  // If no internal layout provided, use default order
  const layout = internalLayout || [
    { elementKey: 'Header', isVisible: true },
    { elementKey: 'DeviceInfo', isVisible: true },
    { elementKey: 'StepsTracker', isVisible: true },
    { elementKey: 'VitalsRow', isVisible: true },
    { elementKey: 'AITip', isVisible: true },
  ];

  return (
    <div className="wearable-section">
      <AnimatePresence>
        {layout.filter(el => el.isVisible).map((el) => {
          const Component = Elements[el.elementKey];
          return Component ? (
            <motion.div 
              key={el.elementKey} 
              layout 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ marginBottom: '20px' }}
            >
              <Component />
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}
