import { motion } from 'framer-motion';

/**
 * Skeuomorphic Toggle Switch Component
 * A premium toggle switch with realistic 3D metallic appearance
 */
const SkeuToggle = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md' // 'sm', 'md', 'lg'
}) => {
  const sizes = {
    sm: { width: 48, height: 26, knob: 20 },
    md: { width: 60, height: 32, knob: 26 },
    lg: { width: 72, height: 38, knob: 32 },
  };

  const { width, height, knob } = sizes[size] || sizes.md;
  const padding = 3;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`skeu-toggle ${checked ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ 
        '--toggle-width': `${width}px`,
        '--toggle-height': `${height}px`,
        '--knob-size': `${knob}px`,
        '--track-padding': `${padding}px`,
      }}
    >
      {/* Track */}
      <div className="skeu-toggle-track" />
      
      {/* Knob with spring animation */}
      <motion.div
        className="skeu-toggle-knob"
        initial={false}
        animate={{
          left: checked ? width - knob - padding : padding,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />
    </button>
  );
};

export default SkeuToggle;
