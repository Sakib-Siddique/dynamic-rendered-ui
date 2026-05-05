import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Elements = {
  ScoreTeal: () => (
    <div className="score-card">
      <div className="score-card-icon teal">✦</div>
      <div className="score-card-value">— —</div>
      <div className="score-card-label">Wellness Score</div>
    </div>
  ),
  ScoreBlue: () => (
    <div className="score-card">
      <div className="score-card-icon blue">😊</div>
      <div className="score-card-value">— —</div>
      <div className="score-card-label">Mood</div>
    </div>
  ),
  ScoreCoral: () => (
    <div className="score-card">
      <div className="score-card-icon coral">♡</div>
      <div className="score-card-value">— —</div>
      <div className="score-card-label">Health Status</div>
    </div>
  )
};

export default function ScoreCards({ internalLayout }) {
  const layout = internalLayout || [
    { elementKey: 'ScoreTeal', isVisible: true, span: 1 },
    { elementKey: 'ScoreBlue', isVisible: true, span: 1 },
    { elementKey: 'ScoreCoral', isVisible: true, span: 1 },
  ];

  return (
    <div className="score-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <AnimatePresence mode="popLayout">
        {layout.filter(el => el.isVisible).map((el) => {
          const Component = Elements[el.elementKey];
          const span = el.span || 1;
          
          return Component ? (
            <motion.div 
              key={el.elementKey} 
              layout 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ gridColumn: `span ${Math.min(span, 3)}` }}
            >
              <Component />
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}
