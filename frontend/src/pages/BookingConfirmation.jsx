import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Calendar, 
  Clock, 
  MapPin,
  Ticket,
  QrCode,
  Home
} from 'lucide-react';
import { format } from 'date-fns';
import { bookingService } from '../api/services';
import { Button, GlassCard, Loader } from '../components/ui';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking not found</h2>
          <Link to="/movies">
            <Button>Browse Movies</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-400" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Your tickets have been booked successfully
          </motion.p>
        </motion.div>

        {/* Ticket Card - Skeuomorphic Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="skeu-ticket mx-4">
            {/* Ticket Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-dark-900">CinemaHub</h2>
                  <p className="text-gray-500 text-sm">E-Ticket</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-mono font-bold text-dark-900">#{booking.id}</p>
              </div>
            </div>

            {/* Movie Info */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-dark-900 mb-2">
                {booking.show_details?.movie_title}
              </h3>
              <p className="text-gray-500">
                {booking.show_details?.movie_details?.genre}
              </p>
            </div>

            {/* Show Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Date</span>
                </div>
                <p className="font-semibold text-dark-900">
                  {booking.show_details?.show_date &&
                    format(new Date(booking.show_details.show_date), 'EEE, MMM d, yyyy')}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Time</span>
                </div>
                <p className="font-semibold text-dark-900">
                  {booking.show_details?.show_time}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Theater</span>
                </div>
                <p className="font-semibold text-dark-900">
                  {booking.show_details?.theater_name}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Ticket className="w-4 h-4" />
                  <span className="text-sm">Seats</span>
                </div>
                <p className="font-semibold text-dark-900">
                  {booking.seats?.map(s => `${s.row}${s.number}`).join(', ')}
                </p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-dashed border-gray-300">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-dark-900">
                  TZS {booking.total_amount?.toLocaleString()}
                </p>
              </div>
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-8"
        >
          <Button variant="clay" icon={Download}>
            Download Ticket
          </Button>
          <Button variant="glass" icon={Share2}>
            Share
          </Button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <GlassCard>
            <h3 className="font-bold text-white mb-4">Important Information</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Please arrive at least 15 minutes before showtime</li>
              <li>• Show this e-ticket at the entrance</li>
              <li>• Outside food and beverages are not allowed</li>
              <li>• Children under 3 years are not allowed in theaters</li>
            </ul>
          </GlassCard>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link to="/">
            <Button variant="ghost" icon={Home}>
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
