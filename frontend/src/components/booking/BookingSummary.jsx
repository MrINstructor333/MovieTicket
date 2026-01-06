import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../ui';

const BookingSummary = ({ onProceed, loading = false }) => {
  const { selectedMovie, selectedShow, selectedSeats, calculateTotal, toggleSeat } = useBooking();

  if (!selectedShow) {
    return null;
  }

  const total = calculateTotal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-static p-6 space-y-6"
    >
      <h3 className="text-xl font-bold gradient-text">Booking Summary</h3>

      {/* Movie Info */}
      {selectedMovie && (
        <div className="flex gap-4">
          <img
            src={selectedMovie.poster ? `http://localhost:8000${selectedMovie.poster}` : 'https://via.placeholder.com/80x120'}
            alt={selectedMovie.title}
            className="w-20 h-28 object-cover rounded-xl shadow-lg"
          />
          <div>
            <h4 className="font-semibold text-white">{selectedMovie.title}</h4>
            <p className="text-gray-400 text-sm">{selectedMovie.genre}</p>
            <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
              <Clock className="w-4 h-4" />
              <span>{selectedMovie.duration} min</span>
            </div>
          </div>
        </div>
      )}

      {/* Show Details - Neumorphic Inset Style */}
      <div className="neu-card-inset space-y-3">
        <div className="flex items-center gap-3 text-gray-300">
          <Calendar className="w-4 h-4 text-accent-cyan" />
          <span>{format(new Date(selectedShow.show_date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Clock className="w-4 h-4 text-accent-cyan" />
          <span>{selectedShow.show_time}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <MapPin className="w-4 h-4 text-accent-cyan" />
          <span>{selectedShow.theater_name}</span>
        </div>
      </div>

      {/* Selected Seats */}
      {selectedSeats.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm font-medium">Selected Seats ({selectedSeats.length})</p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <motion.div
                key={seat.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl 
                          bg-gradient-to-r from-accent-cyan/20 to-primary/20
                          border border-accent-cyan/30 text-accent-cyan"
              >
                <span className="font-medium">{seat.row}{seat.number}</span>
                <button
                  onClick={() => toggleSeat(seat)}
                  className="hover:text-red-400 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Base Price</span>
          <span>TZS {selectedShow.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Seats</span>
          <span>× {selectedSeats.length}</span>
        </div>
        <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
          <span>Total</span>
          <span className="gradient-text">TZS {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Button - Neumorphic Primary */}
      <Button
        variant="primary"
        fullWidth
        onClick={onProceed}
        disabled={selectedSeats.length === 0}
        loading={loading}
        size="lg"
      >
        {selectedSeats.length === 0 ? 'Select Seats' : 'Proceed to Payment'}
      </Button>
    </motion.div>
  );
};

export default BookingSummary;
