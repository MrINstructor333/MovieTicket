import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film } from 'lucide-react';
import { Button } from '../components/ui';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center"
        >
          <Film className="w-16 h-16 text-accent-cyan" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-bold gradient-text mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-4"
        >
          Scene Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 mb-8 max-w-md mx-auto"
        >
          Looks like this scene was cut from the final edit. 
          Let's get you back to the main feature.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/">
            <Button variant="clay" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/movies">
            <Button variant="glass" icon={Film}>
              Browse Movies
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
