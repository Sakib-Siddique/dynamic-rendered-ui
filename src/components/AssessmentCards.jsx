import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Elements = {
  PHQ2: () => (
    <div className="assessment-card coral">
      <div className="assessment-icon coral-bg">📋</div>
      <div className="assessment-text">
        <h4>PHQ 2</h4>
        <p>Check in on your mood</p>
      </div>
    </div>
  ),
  GAD2: () => (
    <div className="assessment-card orange">
      <div className="assessment-icon orange-bg">📊</div>
      <div className="assessment-text">
        <h4>GAD2</h4>
        <p>Check your anxiety levels</p>
      </div>
    </div>
  ),
  DASS21: () => (
    <div className="assessment-card green">
      <div className="assessment-icon green-bg">🩺</div>
      <div className="assessment-text">
        <h4>DASS-21</h4>
        <p>Check your balanced health</p>
      </div>
    </div>
  )
};

export default function AssessmentCards({ internalLayout }) {
  const layout = internalLayout || [
    { elementKey: 'PHQ2', isVisible: true, span: 1 },
    { elementKey: 'GAD2', isVisible: true, span: 1 },
    { elementKey: 'DASS21', isVisible: true, span: 2 },
  ];

  return (
    <div className="assessment-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                layout: { duration: 0.3 }
              }}
              style={{ gridColumn: `span ${span}` }}
            >
              <Component />
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>
    </div>
  );
}
