import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const insights = [
  { text: "Your metrics look balanced today! Keep up the great work.", type: "check" },
  { text: "Hydration check! Have you had a glass of water recently?", type: "check" },
  { text: "Gratitude practice: Think of one small thing you are thankful for today.", type: "done", icon: "✓" },
];

const Elements = {
  Header: ({ variant }) => (
    <div className={`insights-header variant-${variant}`}>
      <span className="insights-dot" />
      <h3>Personalized Insights</h3>
    </div>
  ),
  Insight1: ({ variant }) => (
    <div className={`insight-item variant-${variant}`}>
      <div className="insight-check gray">○</div>
      <div className="insight-text">Your metrics look balanced today! Keep up the great work.</div>
    </div>
  ),
  Insight2: ({ variant }) => (
    <div className={`insight-item variant-${variant}`}>
      <div className="insight-check gray">○</div>
      <div className="insight-text">Hydration check! Have you had a glass of water recently?</div>
    </div>
  ),
  Insight3: ({ variant }) => (
    <div className={`insight-item variant-${variant}`}>
      <div className="insight-check green">✓</div>
      <div className="insight-text">Gratitude practice: Think of one small thing you are thankful for today.</div>
    </div>
  )
};

export default function PersonalizedInsights({ internalLayout, designVariant }) {
  const layout = internalLayout || [
    { elementKey: 'Header', isVisible: true, designVariant: 'default' },
    { elementKey: 'Insight1', isVisible: true, designVariant: 'default' },
    { elementKey: 'Insight2', isVisible: true, designVariant: 'default' },
    { elementKey: 'Insight3', isVisible: true, designVariant: 'default' },
  ];

  return (
    <div className={`insights-card variant-${designVariant}`}>
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
              <Component variant={el.designVariant || designVariant} />
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}
