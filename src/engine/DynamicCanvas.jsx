import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentRegistry from './ComponentRegistry';

const cardVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function DynamicCanvas({ layoutConfig }) {
  const visibleItems = layoutConfig.filter((item) => item.isVisible);

  return (
    <div className="dashboard-grid">
      <AnimatePresence mode="popLayout">
        {visibleItems.map((item) => {
          const entry = ComponentRegistry[item.componentKey];
          if (!entry) return null;

          const Component = entry.component;
          const spanClass = `grid-span-${item.gridSpan}`;

          return (
            <motion.div
              key={item.id}
              layoutId={item.componentKey}
              className={spanClass}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 250,
                  damping: 30,
                },
              }}
            >
              {/* Pass the internal layout and design variant down */}
              <Component 
                internalLayout={item.internalLayout} 
                designVariant={item.designVariant} 
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
