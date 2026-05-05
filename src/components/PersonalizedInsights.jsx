import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const insights = [
  { text: "Your metrics look balanced today! Keep up the great work.", type: "check" },
  { text: "Hydration check! Have you had a glass of water recently?", type: "check" },
  { text: "Gratitude practice: Think of one small thing you are thankful for today.", type: "done", icon: "✓" },
];

const Elements = {
  Header: () => (
    <div className="insights-header">
      <span className="insights-dot" />
      <h3>Personalized Insights</h3>
    </div>
  ),
  Insight1: () => (
    <div className="insight-item">
      <div className="insight-check gray">○</div>
      <div className="insight-text">Your metrics look balanced today! Keep up the great work.</div>
    </div>
  ),
  Insight2: () => (
    <div className="insight-item">
      <div className="insight-check gray">○</div>
      <div className="insight-text">Hydration check! Have you had a glass of water recently?</div>
    </div>
  ),
  Insight3: () => (
    <div className="insight-item">
      <div className="insight-check green">✓</div>
      <div className="insight-text">Gratitude practice: Think of one small thing you are thankful for today.</div>
    </div>
  )
};

export default function PersonalizedInsights({ internalLayout }) {
  const layout = internalLayout || [
    { elementKey: 'Header', isVisible: true },
    { elementKey: 'Insight1', isVisible: true },
    { elementKey: 'Insight2', isVisible: true },
    { elementKey: 'Insight3', isVisible: true },
  ];

  return (
    <div className="insights-card">
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
              style={{ marginBottom: '16px' }}
            >
              <Component />
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}
