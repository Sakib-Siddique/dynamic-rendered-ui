import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Elements = {
  PHQ2: ({ variant }) => (
    <div className={`assessment-card coral variant-${variant}`}>
      <div className="assessment-icon coral-bg">📋</div>
      <div className="assessment-text">
        <h4>PHQ 2</h4>
        <p>Check in on your mood</p>
      </div>
    </div>
  ),
  GAD2: ({ variant }) => (
    <div className={`assessment-card orange variant-${variant}`}>
      <div className="assessment-icon orange-bg">📊</div>
      <div className="assessment-text">
        <h4>GAD2</h4>
        <p>Check your anxiety levels</p>
      </div>
    </div>
  ),
  DASS21: ({ variant }) => (
    <div className={`assessment-card green variant-${variant}`}>
      <div className="assessment-icon green-bg">🩺</div>
      <div className="assessment-text">
        <h4>DASS-21</h4>
        <p>Check your balanced health</p>
      </div>
    </div>
  )
};

export default function AssessmentCards({ internalLayout, designVariant }) {
  const layout = internalLayout || [
    { elementKey: 'PHQ2', isVisible: true, designVariant: 'default' },
    { elementKey: 'GAD2', isVisible: true, designVariant: 'default' },
    { elementKey: 'DASS21', isVisible: true, designVariant: 'default' },
  ];

  return (
    <div className={`assessment-row variant-${designVariant}`}>
      <AnimatePresence>
        {layout.filter(el => el.isVisible).map((el) => {
          const Component = Elements[el.elementKey];
          return Component ? (
            <motion.div 
              key={el.elementKey} 
              layout 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                layout: { duration: 0.3 }
              }}
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
