import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Calendar,
  Clock,
  Film,
  User,
  CreditCard,
  Eye,
  X,
  Ticket,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Download
} from 'lucide-react';
import api from '../../api/axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/');
      setBookings(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      // Mock data for demonstration
      setBookings([
        {
          id: 'BK001',
          user: { id: 1, name: 'John Doe', email: 'john@example.com' },
          show: {
            movie: { title: 'The Dark Knight', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
            screen: { name: 'Screen 1' },
            show_date: '2024-12-20',
            show_time: '19:30',
          },
          seats: ['A1', 'A2', 'A3'],
          total_price: 45.00,
          status: 'confirmed',
          payment_method: 'Credit Card',
          created_at: '2024-12-18T14:30:00Z',
        },
        {
          id: 'BK002',
          user: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
          show: {
            movie: { title: 'Inception', poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Ber.jpg' },
            screen: { name: 'Screen 2' },
            show_date: '2024-12-20',
            show_time: '20:00',
          },
          seats: ['B5', 'B6'],
          total_price: 25.00,
          status: 'confirmed',
          payment_method: 'PayPal',
          created_at: '2024-12-18T15:45:00Z',
        },
        {
          id: 'BK003',
          user: { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
          show: {
            movie: { title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
            screen: { name: 'IMAX' },
            show_date: '2024-12-21',
            show_time: '18:00',
          },
          seats: ['C10', 'C11', 'C12', 'C13'],
          total_price: 72.00,
          status: 'pending',
          payment_method: 'Credit Card',
          created_at: '2024-12-18T16:20:00Z',
        },
        {
          id: 'BK004',
          user: { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
          show: {
            movie: { title: 'The Hangover', poster: 'https://image.tmdb.org/t/p/w500/uluhlXubGu1VxU63X9VHCLWDAYP.jpg' },
            screen: { name: 'Screen 1' },
            show_date: '2024-12-19',
            show_time: '14:00',
          },
          seats: ['D1', 'D2'],
          total_price: 20.00,
          status: 'cancelled',
          payment_method: 'Credit Card',
          created_at: '2024-12-17T10:15:00Z',
        },
        {
          id: 'BK005',
          user: { id: 5, name: 'Charlie Davis', email: 'charlie@example.com' },
          show: {
            movie: { title: 'Titanic', poster: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg' },
            screen: { name: 'VIP Lounge' },
            show_date: '2024-12-22',
            show_time: '21:00',
          },
          seats: ['VIP1', 'VIP2'],
          total_price: 60.00,
          status: 'confirmed',
          payment_method: 'Debit Card',
          created_at: '2024-12-18T18:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.show?.movie?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && booking.status === statusFilter;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.total_price, 0),
  };

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
          <h1 className="text-3xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400 mt-1">Manage customer reservations</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl font-medium transition-colors border border-white/5">
          <Download className="w-5 h-5" />
          Export
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
      >
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Ticket className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
              <p className="text-sm text-gray-400">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.cancelled}</p>
              <p className="text-sm text-gray-400">Cancelled</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <DollarSign className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${stats.revenue.toFixed(2)}</p>
              <p className="text-sm text-gray-400">Revenue</p>
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
            placeholder="Search by ID, name, email, or movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-search w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="neu-tabs">
          {[
            { value: 'all', label: 'All' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`neu-tab ${statusFilter === filter.value ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bookings Table - Desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:block"
      >
        <motion.div variants={itemVariants} className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Movie</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Show</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Seats</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center">
                      <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
                      <p className="text-gray-400">Try adjusting your search or filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-white font-mono text-sm">{booking.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium">{booking.user?.name}</p>
                          <p className="text-gray-500 text-sm">{booking.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded-md overflow-hidden bg-dark-800 flex-shrink-0">
                            {booking.show?.movie?.poster ? (
                              <img
                                src={booking.show.movie.poster}
                                alt={booking.show.movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <span className="text-white font-medium truncate max-w-[150px]">
                            {booking.show?.movie?.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-white">{formatDate(booking.show?.show_date)}</p>
                          <p className="text-gray-500">{formatTime(booking.show?.show_time)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {booking.seats?.slice(0, 3).map((seat, i) => (
                            <span key={i} className="px-2 py-0.5 bg-dark-800 text-gray-300 text-xs rounded">
                              {seat}
                            </span>
                          ))}
                          {booking.seats?.length > 3 && (
                            <span className="px-2 py-0.5 bg-dark-800 text-gray-400 text-xs rounded">
                              +{booking.seats.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-white font-semibold">${booking.total_price?.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Bookings Cards - Mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="md:hidden space-y-4"
      >
        {filteredBookings.length === 0 ? (
          <div className="bento-card text-center py-12">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={itemVariants}
              className="bento-card p-4"
            >
              {/* Header with ID and Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-mono text-xs">#{booking.id}</span>
                {getStatusBadge(booking.status)}
              </div>

              {/* Movie Info */}
              <div className="flex gap-3 mb-4">
                <div className="w-14 h-20 rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                  {booking.show?.movie?.poster ? (
                    <img
                      src={booking.show.movie.poster}
                      alt={booking.show.movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{booking.show?.movie?.title}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(booking.show?.show_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(booking.show?.show_time)}</span>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent-cyan/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{booking.user?.name}</p>
                  <p className="text-gray-500 text-xs truncate">{booking.user?.email}</p>
                </div>
              </div>

              {/* Seats and Price */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-xs mb-1.5">Seats</p>
                  <div className="flex flex-wrap gap-1">
                    {booking.seats?.slice(0, 4).map((seat, i) => (
                      <span key={i} className="px-2 py-0.5 bg-dark-800 text-gray-300 text-xs rounded">
                        {seat}
                      </span>
                    ))}
                    {booking.seats?.length > 4 && (
                      <span className="px-2 py-0.5 bg-dark-800 text-gray-400 text-xs rounded">
                        +{booking.seats.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs mb-1">Total</p>
                  <p className="text-white font-bold text-lg">${booking.total_price?.toFixed(2)}</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedBooking(booking)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                           bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="text-lg font-semibold text-white">Booking Details</h3>
                <p className="text-sm text-gray-400">ID: {selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Movie Info */}
              <div className="flex gap-4">
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-dark-900 flex-shrink-0">
                  {selectedBooking.show?.movie?.poster ? (
                    <img
                      src={selectedBooking.show.movie.poster}
                      alt={selectedBooking.show.movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {selectedBooking.show?.movie?.title}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedBooking.show?.show_date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(selectedBooking.show?.show_time)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-dark-900 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Customer
                  </p>
                  <p className="text-white font-medium">{selectedBooking.user?.name}</p>
                  <p className="text-gray-500 text-sm">{selectedBooking.user?.email}</p>
                </div>
                <div className="p-4 bg-dark-900 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Payment
                  </p>
                  <p className="text-white font-medium">{selectedBooking.payment_method}</p>
                  <p className="text-gray-500 text-sm">{formatDateTime(selectedBooking.created_at)}</p>
                </div>
              </div>

              {/* Seats */}
              <div className="p-4 bg-dark-900 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Seats ({selectedBooking.seats?.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.seats?.map((seat, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 text-sm rounded-lg font-medium">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent-cyan/10 border border-primary/20 rounded-xl">
                <span className="text-gray-300 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-white">${selectedBooking.total_price?.toFixed(2)}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminBookings;
