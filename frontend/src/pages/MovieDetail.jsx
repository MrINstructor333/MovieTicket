import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Star, 
  Calendar, 
  Play, 
  ArrowLeft,
  Users,
  Film
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { movieService, showService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Button, GlassCard, Loader } from '../components/ui';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectMovie, selectShow } = useBooking();
  
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, showsResponse] = await Promise.all([
          movieService.getById(id),
          showService.getByMovie(id),
        ]);
        
        setMovie(movieData);
        
        // Handle paginated response for shows
        const showsData = showsResponse.results || showsResponse || [];
        setShows(showsData);
        
        // Set default selected date if shows available
        if (showsData.length > 0) {
          const uniqueDates = [...new Set(showsData.map(s => s.show_date))].sort();
          setSelectedDate(uniqueDates[0]);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleShowSelect = (show) => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login', { state: { from: `/movies/${id}` } });
      return;
    }
    
    selectMovie(movie);
    selectShow(show);
    setSelectedShowId(show.id);
  };

  const handleProceed = () => {
    if (selectedShowId) {
      navigate(`/booking/${selectedShowId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
        </div>
      </div>
    );
  }

  const uniqueDates = [...new Set(shows.map(s => s.show_date))].sort();
  const showsForDate = shows.filter(s => s.show_date === selectedDate);

  // Use poster_url first, then poster, then placeholder
  const posterUrl = movie.poster_url 
    || (movie.poster 
        ? (movie.poster.startsWith('http') 
            ? movie.poster 
            : `http://localhost:8000${movie.poster}`)
        : 'https://via.placeholder.com/400x600?text=No+Poster');

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={posterUrl}
            alt=""
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="neu-button flex items-center gap-2 px-4 py-2 mt-8 text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          <div className="flex flex-col md:flex-row gap-8 pt-8">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent-cyan rounded-3xl blur-2xl opacity-30" />
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="relative w-64 h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 space-y-6"
            >
              <div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3
                  ${movie.status === 'NOW_SHOWING' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                  }`}
                >
                  {movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <p className="text-accent-cyan text-lg">{movie.genre}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5 text-accent-cyan" />
                  <span>{movie.duration} minutes</span>
                </div>
                {movie.rating && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                    <span>{movie.rating}/10</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-5 h-5 text-accent-cyan" />
                  <span>{format(new Date(movie.release_date), 'MMMM d, yyyy')}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                <p className="text-gray-400 leading-relaxed">{movie.description}</p>
              </div>

              {/* Cast & Crew */}
              {movie.cast && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.split(',').map((actor, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-sm border border-white/10"
                      >
                        {actor.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer Button */}
              {movie.trailer_url && (
                <Button
                  variant="glass"
                  icon={Play}
                  onClick={() => window.open(movie.trailer_url, '_blank')}
                >
                  Watch Trailer
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Show Times Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold gradient-text mb-6">Select Showtime</h2>

          {shows.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No shows available</h3>
              <p className="text-gray-400">Check back later for upcoming showtimes</p>
            </GlassCard>
          ) : (
            <>
              {/* Date Selection */}
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                {uniqueDates.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  
                  return (
                    <motion.button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center px-6 py-4 rounded-xl transition-all shrink-0
                        ${isSelected
                          ? 'bg-gradient-to-br from-primary to-accent-cyan text-white'
                          : 'glass-card text-gray-300 hover:text-white'
                        }`}
                    >
                      <span className="text-sm font-medium">{format(dateObj, 'EEE')}</span>
                      <span className="text-2xl font-bold">{format(dateObj, 'd')}</span>
                      <span className="text-xs">{format(dateObj, 'MMM')}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Show Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {showsForDate.map((show) => {
                  const isSelected = selectedShowId === show.id;
                  
                  return (
                    <motion.div
                      key={show.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => handleShowSelect(show)}
                        className={`w-full p-6 rounded-2xl text-left transition-all
                          ${isSelected
                            ? 'bg-gradient-to-br from-primary/30 to-accent-cyan/20 border-2 border-accent-cyan shadow-lg shadow-accent-cyan/20'
                            : 'glass-card hover:border-accent-cyan/50'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-2xl font-bold text-white">{show.show_time}</p>
                            <p className="text-gray-400">{show.theater_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-accent-cyan font-bold text-lg">
                              TZS {show.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{show.available_seats} seats available</span>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Proceed Button */}
              {selectedShowId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <Button variant="clay" size="lg" onClick={handleProceed}>
                    Select Seats & Continue
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default MovieDetail;
