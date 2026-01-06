import { motion } from 'framer-motion';

const Toggle = ({ 
  checked = false, 
  onChange, 
  label,
  disabled = false,
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: { track: 'w-10 h-5', thumb: 'w-4 h-4', translate: 'left-[22px]' },
    md: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'left-[30px]' },
    lg: { track: 'w-16 h-8', thumb: 'w-7 h-7', translate: 'left-[34px]' },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div 
        className={`
          ${sizeConfig.track}
          rounded-full relative
          transition-all duration-300
          ${checked 
            ? 'bg-gradient-to-r from-primary to-accent-cyan shadow-[inset_3px_3px_8px_#003366,inset_-3px_-3px_8px_#0066cc]' 
            : 'bg-gradient-to-br from-[#142235] to-[#0f1a2a] shadow-[inset_3px_3px_8px_#0a1525,inset_-3px_-3px_8px_#1e3a5f]'
          }
        `}
        onClick={() => !disabled && onChange?.(!checked)}
      >
        <motion.div
          className={`
            ${sizeConfig.thumb}
            absolute top-[2px]
            rounded-full
            ${checked 
              ? 'bg-gradient-to-br from-accent-cyan to-primary shadow-[0_0_15px_rgba(0,212,255,0.5),2px_2px_4px_#003366]' 
              : 'bg-gradient-to-br from-[#1e3a5f] to-[#152a45] shadow-[3px_3px_6px_#0a1525,-2px_-2px_5px_#243d5a]'
            }
          `}
          initial={false}
          animate={{ 
            left: checked ? sizeConfig.translate.replace('left-[', '').replace(']', '') : '2px'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-300">{label}</span>
      )}
    </label>
  );
};

export default Toggle;
