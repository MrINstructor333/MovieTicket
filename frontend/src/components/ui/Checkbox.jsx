import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <label 
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <motion.div
        className={`
          ${sizes[size]}
          rounded-lg flex items-center justify-center
          transition-all duration-200
          ${checked 
            ? 'bg-gradient-to-br from-primary to-accent-cyan shadow-[3px_3px_8px_#0a1525,-3px_-3px_8px_#243d5a,0_0_15px_rgba(0,102,255,0.3)]' 
            : 'bg-gradient-to-br from-[#142235] to-[#0f1a2a] shadow-[inset_3px_3px_6px_#0a1525,inset_-3px_-3px_6px_#1e3a5f]'
          }
        `}
        onClick={() => !disabled && onChange?.(!checked)}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <motion.div
          initial={false}
          animate={{ 
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check className={`${iconSizes[size]} text-white`} strokeWidth={3} />
        </motion.div>
      </motion.div>
      {label && (
        <span className="text-sm font-medium text-gray-300">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
