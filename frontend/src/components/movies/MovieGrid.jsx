import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, title, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="clay-card overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-dark-700 rounded-xl" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-dark-700 rounded w-3/4" />
                <div className="h-4 bg-dark-700 rounded w-1/2" />
                <div className="h-4 bg-dark-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {title && (
        <h2 className="text-2xl font-bold gradient-text">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default MovieGrid;
