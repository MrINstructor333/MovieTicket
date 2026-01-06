import { motion } from 'framer-motion';

const Slider = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-accent-cyan">{value}</span>}
        </div>
      )}
      <div className="relative h-10 flex items-center">
        {/* Track Background */}
        <div 
          className="w-full h-2.5 rounded-full bg-gradient-to-br from-[#142235] to-[#0f1a2a]"
          style={{
            boxShadow: 'inset 3px 3px 6px #0a1525, inset -3px -3px 6px #1e3a5f'
          }}
        >
          {/* Active Track */}
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan"
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
            }}
          />
        </div>

        {/* Native Input (hidden but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {/* Custom Thumb */}
        <motion.div
          className="absolute w-6 h-6 rounded-full pointer-events-none"
          initial={false}
          animate={{ left: `calc(${percentage}% - 12px)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            background: 'linear-gradient(145deg, #0073e6, #0052a3)',
            boxShadow: `
              4px 4px 10px #0a1525,
              -2px -2px 6px #243d5a,
              0 0 15px rgba(0, 102, 255, 0.3)
            `
          }}
        />
      </div>
    </div>
  );
};

export default Slider;
