import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';

const SeatMap = ({ seats, bookedSeats = [] }) => {
  const { selectedSeats, toggleSeat } = useBooking();

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Sort seats within each row by seat number
  Object.keys(seatsByRow).forEach((row) => {
    seatsByRow[row].sort((a, b) => {
      // Extract number from seat_number (e.g., "A1" -> 1)
      const numA = parseInt(a.seat_number?.replace(/[^0-9]/g, '') || '0');
      const numB = parseInt(b.seat_number?.replace(/[^0-9]/g, '') || '0');
      return numA - numB;
    });
  });

  const rows = Object.keys(seatsByRow).sort();

  const getSeatStatus = (seat) => {
    // Check if seat is booked (from bookedSeats array or is_booked flag)
    if (bookedSeats.includes(seat.id) || seat.is_booked) return 'booked';
    if (selectedSeats.find((s) => s.id === seat.id)) return 'selected';
    return 'available';
  };

  const getSeatClass = (seat) => {
    const status = getSeatStatus(seat);
    let className = 'seat ';
    
    switch (status) {
      case 'booked':
        className += 'seat-booked';
        break;
      case 'selected':
        className += 'seat-selected';
        break;
      default:
        className += 'seat-available';
    }
    
    // Add seat type class (handle both uppercase and lowercase)
    const seatType = seat.seat_type?.toLowerCase();
    if (seatType === 'vip') className += ' seat-vip';
    else if (seatType === 'premium') className += ' seat-premium';
    
    return className;
  };

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat.id) || seat.is_booked) return;
    toggleSeat(seat);
  };

  // Get seat display number (just the number part)
  const getSeatNumber = (seat) => {
    if (seat.seat_number) {
      return seat.seat_number.replace(/[^0-9]/g, '') || seat.seat_number;
    }
    return seat.number || '';
  };

  return (
    <div className="space-y-8">
      {/* Screen */}
      <div className="text-center">
        <div className="cinema-screen max-w-xl mx-auto" />
        <p className="text-gray-400 text-sm">SCREEN</p>
      </div>

      {/* Seats */}
      <div className="flex flex-col items-center gap-2 py-8">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.05 }}
            className="flex items-center gap-2"
          >
            {/* Row Label */}
            <div className="w-8 text-gray-400 font-semibold text-center">{row}</div>
            
            {/* Seats */}
            <div className="flex gap-1.5">
              {seatsByRow[row].map((seat, seatIndex) => (
                <motion.button
                  key={seat.id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                  disabled={bookedSeats.includes(seat.id) || seat.is_booked}
                  whileHover={!(bookedSeats.includes(seat.id) || seat.is_booked) ? { scale: 1.1 } : {}}
                  whileTap={!(bookedSeats.includes(seat.id) || seat.is_booked) ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: rowIndex * 0.05 + seatIndex * 0.02 }}
                >
                  {getSeatNumber(seat)}
                </motion.button>
              ))}
            </div>

            {/* Row Label (Right) */}
            <div className="w-8 text-gray-400 font-semibold text-center">{row}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
