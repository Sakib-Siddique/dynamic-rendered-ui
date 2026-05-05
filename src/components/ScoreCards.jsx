import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Elements = {
  ScoreTeal: ({ variant }) => (
    <div className={`score-card variant-${variant}`}>
      <div className="score-card-icon teal">✦</div>
      <div className="score-card-value">— —</div>
      <div className="score-card-label">Wellness Score</div>
    </div>
  ),
  ScoreBlue: ({ variant }) => (
    <div className={`score-card variant-${variant}`}>
      <div className="score-card-icon blue">😊</div>
      <div className="score-card-value">— —</div>
      <div className="score-card-label">Mood</div>
    </div>
  ),
  ScoreCoral: ({ variant }) => (
    <div className={`score-card variant-${variant}`}>
      <div className="score-card-icon coral">♡</div>
      <div className="score-card-value">— —</div>
      <div className="score-card-label">Health Status</div>
    </div>
  )
};

export default function ScoreCards({ internalLayout, designVariant }) {
  const layout = internalLayout || [
    { elementKey: 'ScoreTeal', isVisible: true, designVariant: 'default' },
    { elementKey: 'ScoreBlue', isVisible: true, designVariant: 'default' },
    { elementKey: 'ScoreCoral', isVisible: true, designVariant: 'default' },
  ];

  return (
    <div className={`score-cards-row variant-${designVariant}`}>
      <AnimatePresence>
        {layout.filter(el => el.isVisible).map((el) => {
          const Component = Elements[el.elementKey];
          return Component ? (
            <motion.div 
              key={el.elementKey} 
              layout 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ width: '100%' }}
            >
              <Component variant={el.designVariant || designVariant} />
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}
