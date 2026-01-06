import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  // Neumorphic buttons (primary style)
  primary: 'neu-button-primary',
  neumorphic: 'neu-button',
  
  // Clay/soft neumorphic button
  clay: `
    bg-gradient-to-br from-dark-700 to-dark-800
    text-white font-semibold rounded-xl
    shadow-[6px_6px_14px_rgba(0,0,0,0.4),-6px_-6px_14px_rgba(60,80,100,0.1)]
    hover:shadow-[8px_8px_18px_rgba(0,0,0,0.45),-8px_-8px_18px_rgba(60,80,100,0.15)]
    hover:from-dark-600 hover:to-dark-700
    active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(60,80,100,0.05)]
    transition-all duration-300
  `,
  
  // Glass variants for specific use cases
  glass: `
    bg-gradient-to-r from-primary/30 to-accent-cyan/20
    backdrop-blur-xl border border-accent-cyan/30
    text-white font-semibold rounded-xl
    hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]
  `,
  
  // Other variants
  secondary: 'neu-button text-gray-300 hover:text-accent-cyan',
  danger: `
    bg-gradient-to-br from-red-600 to-red-700
    text-white font-semibold rounded-xl
    shadow-[6px_6px_14px_#0a1525,-6px_-6px_14px_#243d5a]
    hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
  `,
  ghost: `
    bg-transparent text-accent-cyan font-semibold
    rounded-xl hover:bg-white/5 transition-all
    border border-transparent hover:border-accent-cyan/30
  `,
  outline: `
    bg-transparent border-2 border-accent-cyan/50
    text-accent-cyan font-semibold rounded-xl
    hover:bg-accent-cyan/10 hover:border-accent-cyan
    transition-all
  `,
};

const sizes = {
  sm: 'text-sm py-2 px-4',
  md: 'text-base py-3 px-6',
  lg: 'text-lg py-4 px-8',
  xl: 'text-xl py-5 px-10',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant] || variants.primary}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // For form submission buttons, use a regular button with motion wrapper
  // to ensure type="submit" works correctly
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Check if this is a primary button for enhanced animations
  const isPrimary = variant === 'primary';

  // Enhanced motion variants for more satisfying interactions
  const buttonMotion = {
    hover: isPrimary ? {
      y: -6,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    } : {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: isPrimary ? {
      y: 3,
      scale: 0.96,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    } : {
      y: 2,
      scale: 0.97,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    }
  };

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      initial={{ y: 0 }}
      whileHover={disabled ? {} : buttonMotion.hover}
      whileTap={disabled ? {} : buttonMotion.tap}
      {...props}
    >
      {loading ? (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: -2 }}
            >
              <Icon className="w-5 h-5" />
            </motion.span>
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 2 }}
            >
              <Icon className="w-5 h-5" />
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;
