import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);

  const selectMovie = useCallback((movie) => {
    setSelectedMovie(movie);
    setSelectedShow(null);
    setSelectedSeats([]);
  }, []);

  const selectShow = useCallback((show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  }, []);

  const toggleSeat = useCallback((seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const calculateTotal = useCallback(() => {
    if (!selectedShow || selectedSeats.length === 0) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      const basePrice = selectedShow.price;
      let multiplier = 1;
      
      if (seat.seat_type === 'VIP') multiplier = 1.5;
      else if (seat.seat_type === 'PREMIUM') multiplier = 1.25;
      
      return total + (basePrice * multiplier);
    }, 0);
  }, [selectedShow, selectedSeats]);

  const resetBooking = useCallback(() => {
    setSelectedMovie(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setBookingDetails(null);
  }, []);

  const value = {
    selectedMovie,
    selectedShow,
    selectedSeats,
    bookingDetails,
    selectMovie,
    selectShow,
    toggleSeat,
    clearSelection,
    calculateTotal,
    setBookingDetails,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
