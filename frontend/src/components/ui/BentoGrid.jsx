import { motion } from 'framer-motion';

const BentoGrid = ({ children, className = '' }) => {
  return (
    <div className={`bento-grid ${className}`}>
      {children}
    </div>
  );
};

const BentoItem = ({ 
  children, 
  className = '', 
  span = 1,
  rowSpan = 1,
  ...props 
}) => {
  const spanClass = span === 2 ? 'span-2' : span === 3 ? 'span-3' : span === 4 ? 'span-4' : '';
  const rowSpanClass = rowSpan === 2 ? 'row-span-2' : '';

  return (
    <motion.div
      className={`bento-item ${spanClass} ${rowSpanClass} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { BentoGrid, BentoItem };
