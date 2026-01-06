import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, Calendar, Play } from 'lucide-react';
import { format } from 'date-fns';

const MovieCard = ({ movie, index = 0 }) => {
  // Use poster_url first, then poster, then placeholder
  const posterUrl = movie.poster_url 
    || (movie.poster 
        ? (movie.poster.startsWith('http') 
            ? movie.poster 
            : `http://localhost:8000${movie.poster}`)
        : 'https://via.placeholder.com/300x450?text=No+Poster');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/movies/${movie.id}`}>
        {/* Glass Card Container with enhanced hover */}
        <motion.div 
          className="group relative glass-card p-0 overflow-hidden cursor-pointer"
          whileHover={{ 
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 212, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-[24px]">
            <motion.img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            
            {/* Multi-layer Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </div>
            
            {/* Play Button - Enhanced Neumorphic Style */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full flex items-center justify-center relative
                          bg-gradient-to-br from-accent-cyan to-primary"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Button glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-cyan to-primary blur-xl opacity-60" />
                <Play className="w-8 h-8 text-white ml-1 relative z-10" fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Rating Badge - Enhanced Glass Style */}
            {movie.rating && (
              <motion.div 
                className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-xl
                          bg-dark-900/70 backdrop-blur-md border border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="text-white text-sm font-semibold">{movie.rating}</span>
              </motion.div>
            )}

            {/* Status Badge - Enhanced Glass Style */}
            <motion.div 
              className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl text-xs font-semibold
                        backdrop-blur-md border
                ${movie.status === 'NOW_SHOWING' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                  : 'bg-accent-purple/20 text-accent-purple border-accent-purple/30 shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
            </motion.div>
          </div>

          {/* Info Section with enhanced styling */}
          <div className="p-5 space-y-3 relative">
            {/* Subtle top edge highlight */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors duration-300 line-clamp-1">
              {movie.title}
            </h3>
            
            <p className="text-gray-400 text-sm line-clamp-2">
              {movie.genre}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1.5 group-hover:text-gray-300 transition-colors">
                <Clock className="w-4 h-4 text-accent-cyan/70" />
                <span>{movie.duration} min</span>
              </div>
              {movie.release_date && (
                <div className="flex items-center gap-1.5 group-hover:text-gray-300 transition-colors">
                  <Calendar className="w-4 h-4 text-accent-cyan/70" />
                  <span>{format(new Date(movie.release_date), 'MMM yyyy')}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
