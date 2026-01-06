import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default', // 'default', 'static', 'sidebar', 'dropdown'
  hover = true,
  padding = true,
  onClick,
  ...props 
}) => {
  const variants = {
    default: 'glass-card',
    static: 'glass-card-static',
    sidebar: 'glass-sidebar',
    dropdown: 'glass-dropdown',
    tooltip: 'glass-tooltip',
  };

  return (
    <motion.div
      className={`${variants[variant] || variants.default} ${padding ? 'p-6' : ''} ${className}`}
      whileHover={hover ? { y: -8, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
