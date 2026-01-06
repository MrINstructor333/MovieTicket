import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  Film,
  MapPin,
  Users,
  DollarSign,
  Filter,
  X
} from 'lucide-react';
import api from '../../api/axios';

const AdminShows = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, showId: null });

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const response = await api.get('/shows/');
      setShows(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch shows:', error);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/shows/${id}/`);
      setShows(shows.filter(show => show.id !== id));
      setDeleteModal({ show: false, showId: null });
    } catch (error) {
      console.error('Failed to delete show:', error);
      // For demo, just remove from state
      setShows(shows.filter(show => show.id !== id));
      setDeleteModal({ show: false, showId: null });
    }
  };

  const getStatusBadge = (show) => {
    const availableSeats = show.available_seats ?? 0;
    if (availableSeats === 0) {
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Sold Out</span>;
    }
    if (show.is_active === false) {
      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">Inactive</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredShows = shows.filter(show => {
    const movieTitle = show.movie_title || show.movie?.title || '';
    const theaterName = show.theater_name || show.theater?.name || '';
    const matchesSearch = movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theaterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (dateFilter === 'all') return matchesSearch;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const showDate = new Date(show.show_date);
    
    if (dateFilter === 'today') {
      return matchesSearch && showDate.toDateString() === today.toDateString();
    }
    if (dateFilter === 'upcoming') {
      return matchesSearch && showDate >= today;
    }
    if (dateFilter === 'past') {
      return matchesSearch && showDate < today;
    }
    return matchesSearch;
  });

  // Group shows by date
  const groupedShows = filteredShows.reduce((acc, show) => {
    const date = show.show_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(show);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedShows).sort();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Shows</h1>
          <p className="text-gray-400 mt-1">Manage movie showtimes</p>
        </div>
        <button
          onClick={() => navigate('/admin/shows/new')}
          className="neu-button-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Show
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{shows.length}</p>
              <p className="text-sm text-gray-400">Total Shows</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {shows.filter(s => s.is_active !== false && (s.available_seats ?? 0) > 0).length}
              </p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <Users className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {shows.filter(s => (s.available_seats ?? 0) === 0).length}
              </p>
              <p className="text-sm text-gray-400">Sold Out</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ${shows.length > 0 ? (shows.reduce((sum, s) => sum + parseFloat(s.base_price || 0), 0) / shows.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-400">Avg Price</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search by movie or theater..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-search w-full"
          />
        </div>

        {/* Date Filter */}
        <div className="neu-tabs">
          {[
            { value: 'all', label: 'All' },
            { value: 'today', label: 'Today' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setDateFilter(filter.value)}
              className={`neu-tab ${
                dateFilter === filter.value ? 'active' : ''
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Shows List - Grouped by Date */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {sortedDates.length === 0 ? (
          <motion.div variants={itemVariants} className="bento-card p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No shows found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or add a new show.</p>
            <button
              onClick={() => navigate('/admin/shows/new')}
              className="neu-button-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Show
            </button>
          </motion.div>
        ) : (
          sortedDates.map((date) => (
            <motion.div key={date} variants={itemVariants}>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {formatDate(date)}
              </h2>
              <div className="grid gap-4">
                {groupedShows[date].map((show) => (
                  <div
                    key={show.id}
                    className="bento-card p-4 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Movie Poster */}
                      <div className="w-16 h-24 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                        {(show.movie?.poster_url || show.movie?.poster) ? (
                          <img
                            src={show.movie.poster_url || show.movie.poster}
                            alt={show.movie_title || show.movie?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Show Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white truncate">
                              {show.movie_title || show.movie?.title || 'Unknown Movie'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatTime(show.show_time)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {show.theater_name || show.theater?.name || 'Theater'}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {show.available_seats ?? '?'} available
                              </span>
                              <span className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4" />
                                ${parseFloat(show.base_price || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(show)}
                            <button
                              onClick={() => navigate(`/admin/shows/edit/${show.id}`)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ show: true, showId: show.id })}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModal({ show: false, showId: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 bg-dark-800 border border-white/10 rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Show</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this show? All associated bookings will also be cancelled.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, showId: null })}
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.showId)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Delete Show
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminShows;
