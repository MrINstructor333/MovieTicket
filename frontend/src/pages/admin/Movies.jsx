import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Film,
  MoreVertical,
  Filter,
  ChevronDown,
  Eye,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { movieService, adminService } from '../../api/services';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await movieService.getAll();
      // Handle both paginated (results array) and direct array responses
      const movieList = data.results || data || [];
      setMovies(movieList.length > 0 ? movieList : mockMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Use mock data on error
      setMovies(mockMovies);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockMovies = [
    { id: 1, title: 'The Dark Knight', genre: 'Action', duration: 152, rating: 9.0, status: 'NOW_SHOWING', poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: 2, title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, status: 'NOW_SHOWING', poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Ber.jpg' },
    { id: 3, title: 'Interstellar', genre: 'Sci-Fi', duration: 169, rating: 8.6, status: 'NOW_SHOWING', poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
    { id: 4, title: 'The Hangover', genre: 'Comedy', duration: 100, rating: 7.7, status: 'COMING_SOON', poster_url: 'https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg' },
    { id: 5, title: 'Titanic', genre: 'Romance', duration: 195, rating: 7.9, status: 'NOW_SHOWING', poster_url: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg' },
    { id: 6, title: 'Avatar', genre: 'Sci-Fi', duration: 162, rating: 7.8, status: 'NOW_SHOWING', poster_url: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg' },
  ];

  const handleDelete = async () => {
    if (!selectedMovie) return;
    
    try {
      await adminService.deleteMovie(selectedMovie.id);
      setMovies(movies.filter(m => m.id !== selectedMovie.id));
      toast.success('Movie deleted successfully');
      setShowDeleteModal(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
    }
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || movie.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-dark-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Movies</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your movie catalog</p>
        </div>
        <Link to="/admin/movies/add">
          <motion.button
            className="neu-button-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       text-white font-semibold text-sm
                       w-full sm:w-auto justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            Add Movie
          </motion.button>
        </Link>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bento-card p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-search w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="neu-select"
            >
              <option value="all">All Status</option>
              <option value="NOW_SHOWING">Now Showing</option>
              <option value="COMING_SOON">Coming Soon</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Movies Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredMovies.map((movie) => (
          <motion.div
            key={movie.id}
            variants={itemVariants}
            className="bento-card overflow-hidden group"
          >
            {/* Movie Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={movie.poster_url || movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <Link to={`/movies/${movie.id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-sm hover:bg-white/20 transition-colors">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </Link>
                  <Link to={`/admin/movies/edit/${movie.id}`}>
                    <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </Link>
                  <button 
                    onClick={() => {
                      setSelectedMovie(movie);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-lg bg-red-500/20 backdrop-blur-sm text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium ${
                movie.status === 'NOW_SHOWING' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
              </div>

              {/* Rating Badge */}
              {movie.rating && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-dark-900/80 backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                  <span className="text-white text-xs font-medium">{movie.rating}</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="p-4">
              <h3 className="text-white font-semibold truncate">{movie.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{movie.genre}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-gray-400 text-xs">{movie.duration} min</span>
                <span className="text-gray-400 text-xs">{movie.release_date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredMovies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search or filters' : 'Add your first movie to get started'}
          </p>
          <Link to="/admin/movies/add">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold">
              <Plus className="w-5 h-5" />
              Add Movie
            </button>
          </Link>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl bg-dark-800 border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-2">Delete Movie</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{selectedMovie?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMovies;
