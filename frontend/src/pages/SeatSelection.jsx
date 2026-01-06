import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { showService, seatService, bookingService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import SeatMap from '../components/booking/SeatMap';
import SeatLegend from '../components/booking/SeatLegend';
import BookingSummary from '../components/booking/BookingSummary';
import { Button, Loader } from '../components/ui';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    selectedMovie, 
    selectedShow, 
    selectShow, 
    selectMovie,
    selectedSeats, 
    setBookingDetails 
  } = useBooking();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const showData = await showService.getById(showId);
        setShow(showData);
        selectShow(showData);
        
        // If no movie selected, fetch it
        if (!selectedMovie && showData.movie) {
          selectMovie(showData.movie_details || { id: showData.movie });
        }
        
        // Get seats with availability status for the show
        try {
          const seatsResponse = await showService.getSeats(showId);
          const seatsData = seatsResponse.results || seatsResponse || [];
          setSeats(seatsData);
          
          // Extract booked seats from the availability info
          const bookedIds = seatsData
            .filter(s => s.is_booked)
            .map(s => s.id);
          setBookedSeats(bookedIds);
        } catch (err) {
          console.log('Could not fetch seats, trying theater seats');
          // Fallback: get seats for the theater
          const seatsResponse = await seatService.getByTheater(showData.theater);
          const seatsData = seatsResponse.results || seatsResponse || [];
          setSeats(seatsData);
          setBookedSeats([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load seat information');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId, isAuthenticated, navigate, selectShow, selectMovie, selectedMovie]);

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    setBooking(true);
    try {
      const bookingData = {
        show: parseInt(showId),
        seats: selectedSeats.map(s => s.id),
      };
      
      const response = await bookingService.create(bookingData);
      setBookingDetails(response);
      toast.success('Seats reserved! Proceed to payment.');
      navigate(`/payment/${response.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setBooking(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="neu-button flex items-center gap-2 px-4 py-2 mb-4 text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Select Your</span>
            <span className="text-white"> Seats</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Choose your preferred seats for the best viewing experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-6 space-y-6">
              <SeatLegend />
              <SeatMap seats={seats} bookedSeats={bookedSeats} />
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="lg:sticky lg:top-24">
              <BookingSummary onProceed={handleProceed} loading={booking} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
