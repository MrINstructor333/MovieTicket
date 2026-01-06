import { motion } from 'framer-motion';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={`${sizes[size]} rounded-full border-4 border-dark-600 border-t-accent-cyan`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-accent-cyan font-medium"
      >
        Loading...
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
