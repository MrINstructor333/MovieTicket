import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  variant = 'neumorphic', // 'neumorphic' or 'glass'
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputVariants = {
    neumorphic: 'neu-input',
    glass: 'input-glass',
  };

  return (
    <motion.div 
      className={`space-y-2 ${containerClassName}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <motion.label 
          className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
            isFocused ? 'text-accent-cyan' : 'text-gray-300'
          }`}
          animate={{ 
            x: isFocused ? 4 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {label}
        </motion.label>
      )}
      <motion.div 
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Glow effect behind input */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: isFocused 
              ? '0 0 30px rgba(0, 212, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.05)'
              : '0 0 0px rgba(0, 212, 255, 0)',
          }}
          transition={{ duration: 0.3 }}
        />
        
        {Icon && (
          <motion.div 
            className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none z-10"
            animate={{ 
              color: isFocused ? '#00d4ff' : '#9ca3af',
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            ${inputVariants[variant] || inputVariants.neumorphic}
            ${Icon ? 'pl-12' : ''}
            ${isPassword ? 'pr-12' : ''}
            ${error ? 'error ring-2 ring-red-500/50' : ''}
            ${className}
          `}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {isPassword && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-0 bottom-0 flex items-center text-gray-400 hover:text-accent-cyan transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.button>
        )}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-sm text-red-400 mt-1 flex items-center gap-1"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

Input.displayName = 'Input';

export default Input;
