import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { movieService } from '../api/services';
import MovieGrid from '../components/movies/MovieGrid';
import { Button, Input } from '../components/ui';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('status') || 'ALL');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 
    'Sci-Fi', 'Thriller', 'Animation', 'Adventure'
  ];

  const filters = [
    { value: 'ALL', label: 'All Movies' },
    { value: 'NOW_SHOWING', label: 'Now Showing' },
    { value: 'COMING_SOON', label: 'Coming Soon' },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;
        const params = {};
        
        if (searchQuery) params.search = searchQuery;
        if (selectedGenre) params.genre = selectedGenre;
        
        if (activeFilter === 'NOW_SHOWING') {
          response = await movieService.getNowShowing();
        } else if (activeFilter === 'COMING_SOON') {
          response = await movieService.getUpcoming();
        } else {
          response = await movieService.getAll(params);
        }
        
        // Handle paginated response format
        let data = response.results || response || [];
        
        // Apply client-side filtering if needed
        if (searchQuery && activeFilter !== 'ALL') {
          data = data.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (selectedGenre) {
          data = data.filter(movie => 
            movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
          );
        }
        
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeFilter, searchQuery, selectedGenre]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeFilter !== 'ALL') params.set('status', activeFilter);
    if (selectedGenre) params.set('genre', selectedGenre);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilter('ALL');
    setSelectedGenre('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || activeFilter !== 'ALL' || selectedGenre;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Discover</span>
            <span className="text-white"> Movies</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse our extensive collection of movies. Find your next favorite film 
            and book your tickets instantly.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search movies by title or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="neu-input w-full pl-12 pr-32 text-lg"
              />
              <Button
                type="submit"
                variant="clay"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`neu-button px-5 py-2.5
                  ${activeFilter === filter.value
                    ? '!bg-gradient-to-r !from-primary !to-accent-cyan !text-white !shadow-lg !shadow-primary/30'
                    : ''
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-2 text-gray-400 mr-2">
              <Filter className="w-4 h-4" />
              Genres:
            </span>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                className={`neu-button px-3 py-1.5 text-sm
                  ${selectedGenre === genre
                    ? '!bg-accent-purple/20 !text-accent-purple !border !border-accent-purple/30'
                    : ''
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 mt-4 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{movies.length}</span> movies
            {searchQuery && (
              <span> for "<span className="text-accent-cyan">{searchQuery}</span>"</span>
            )}
          </p>
        </motion.div>

        {/* Movie Grid */}
        <MovieGrid movies={movies} loading={loading} />

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button variant="glass" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Movies;
