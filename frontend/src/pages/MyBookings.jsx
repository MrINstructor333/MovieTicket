import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, X, Film } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { bookingService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Button, GlassCard, Loader, Modal } from '../components/ui';

const MyBookings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        // Handle paginated response
        const data = response.results || response || [];
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleCancel = async () => {
    if (!cancelModal.bookingId) return;
    
    setCancelling(true);
    try {
      await bookingService.cancel(cancelModal.bookingId);
      setBookings(prev => prev.map(b => 
        b.id === cancelModal.bookingId ? { ...b, status: 'CANCELLED' } : b
      ));
      toast.success('Booking cancelled successfully');
      setCancelModal({ open: false, bookingId: null });
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">My</span>
            <span className="text-white"> Bookings</span>
          </h1>
          <p className="text-gray-400 mt-2">
            View and manage your movie ticket bookings
          </p>
        </motion.div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Ticket className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">
              Start by browsing our amazing collection of movies
            </p>
            <Link to="/movies">
              <Button variant="clay">Browse Movies</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Movie Poster */}
                    <div className="md:w-32 shrink-0">
                      {booking.show_details?.movie_details?.poster ? (
                        <img
                          src={`http://localhost:8000${booking.show_details.movie_details.poster}`}
                          alt={booking.show_details.movie_title}
                          className="w-full h-40 md:h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 md:h-full bg-dark-700 flex items-center justify-center">
                          <Film className="w-10 h-10 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {booking.show_details?.movie_title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Booking #{booking.id}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-1 text-gray-500 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs">Date</span>
                          </div>
                          <p className="text-white text-sm font-medium">
                            {booking.show_details?.show_date &&
                              format(new Date(booking.show_details.show_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-500 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">Time</span>
                          </div>
                          <p className="text-white text-sm font-medium">
                            {booking.show_details?.show_time}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-500 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs">Theater</span>
                          </div>
                          <p className="text-white text-sm font-medium">
                            {booking.show_details?.theater_name}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-500 mb-1">
                            <Ticket className="w-4 h-4" />
                            <span className="text-xs">Seats</span>
                          </div>
                          <p className="text-white text-sm font-medium">
                            {booking.seats?.map(s => `${s.row}${s.number}`).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                        <p className="text-accent-cyan font-bold">
                          TZS {booking.total_amount?.toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          {booking.status === 'CONFIRMED' && (
                            <Link to={`/booking-confirmation/${booking.id}`}>
                              <Button variant="glass" size="sm">
                                View Ticket
                              </Button>
                            </Link>
                          )}
                          {booking.status === 'PENDING' && (
                            <>
                              <Link to={`/payment/${booking.id}`}>
                                <Button variant="clay" size="sm">
                                  Complete Payment
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCancelModal({ open: true, bookingId: booking.id })}
                                className="text-red-400 hover:text-red-300"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        <Modal
          isOpen={cancelModal.open}
          onClose={() => setCancelModal({ open: false, bookingId: null })}
          title="Cancel Booking"
        >
          <div className="space-y-6">
            <p className="text-gray-300">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setCancelModal({ open: false, bookingId: null })}
                fullWidth
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                onClick={handleCancel}
                loading={cancelling}
                fullWidth
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyBookings;
