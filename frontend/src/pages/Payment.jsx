import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  Lock,
  ArrowLeft,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { bookingService, paymentService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { Button, Input, GlassCard, Loader } from '../components/ui';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { resetBooking } = useBooking();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('MPESA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const paymentMethods = [
    { id: 'MPESA', name: 'M-Pesa', icon: Smartphone, color: 'text-green-400' },
    { id: 'TIGO_PESA', name: 'Tigo Pesa', icon: Smartphone, color: 'text-blue-400' },
    { id: 'CARD', name: 'Credit/Debit Card', icon: CreditCard, color: 'text-accent-purple' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const data = await bookingService.getById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Failed to load booking details');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isAuthenticated, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (paymentMethod !== 'CARD' && !phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    if (paymentMethod === 'CARD') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    setProcessing(true);
    try {
      const paymentData = {
        booking: parseInt(bookingId),
        payment_method: paymentMethod,
        phone_number: paymentMethod !== 'CARD' ? phoneNumber : undefined,
      };

      await paymentService.process(paymentData);
      toast.success('Payment successful! Your tickets are confirmed.');
      resetBooking();
      navigate(`/booking-confirmation/${bookingId}`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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
          <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
        </div>
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
          <button
            onClick={() => navigate(-1)}
            className="neu-button flex items-center gap-2 px-4 py-2 mb-4 text-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Complete</span>
            <span className="text-white"> Payment</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Secure payment powered by industry-leading encryption
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="space-y-6">
              <h2 className="text-xl font-bold text-white">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`neu-button w-full flex items-center gap-4 p-4 transition-all
                      ${paymentMethod === method.id
                        ? '!bg-primary/20 !border-2 !border-accent-cyan !shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                        : ''
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center ${method.color}`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <span className="text-white font-medium">{method.name}</span>
                    {paymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-accent-cyan ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Details Form */}
              <form onSubmit={handlePayment} className="space-y-4">
                {paymentMethod !== 'CARD' ? (
                  <Input
                    label="Phone Number"
                    placeholder="e.g., 0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    icon={Smartphone}
                  />
                ) : (
                  <>
                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      icon={CreditCard}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                      <Input
                        label="CVV"
                        placeholder="123"
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Cardholder Name"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </>
                )}

                <div className="flex items-center gap-2 text-gray-400 text-sm pt-4">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <Button
                  type="submit"
                  variant="clay"
                  fullWidth
                  loading={processing}
                >
                  Pay TZS {booking.total_amount?.toLocaleString()}
                </Button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="space-y-6">
              <h2 className="text-xl font-bold text-white">Order Summary</h2>

              {/* Movie Info */}
              <div className="flex gap-4">
                {booking.show_details?.movie_details?.poster && (
                  <img
                    src={`http://localhost:8000${booking.show_details.movie_details.poster}`}
                    alt={booking.show_details.movie_details.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {booking.show_details?.movie_title || 'Movie'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {booking.show_details?.movie_details?.genre}
                  </p>
                </div>
              </div>

              {/* Show Details */}
              <div className="space-y-3 py-4 border-y border-white/10">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-accent-cyan" />
                  <span>
                    {booking.show_details?.show_date && 
                      format(new Date(booking.show_details.show_date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-accent-cyan" />
                  <span>{booking.show_details?.show_time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-accent-cyan" />
                  <span>{booking.show_details?.theater_name}</span>
                </div>
              </div>

              {/* Seats */}
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  Selected Seats ({booking.seats?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats?.map((seat) => (
                    <span
                      key={seat.id}
                      className="px-3 py-1.5 rounded-lg bg-accent-cyan/20 text-accent-cyan font-medium"
                    >
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>TZS {booking.total_amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Service Fee</span>
                  <span>TZS 0</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="gradient-text">TZS {booking.total_amount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Timer Warning */}
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Complete payment within 10 minutes</span>
                </div>
                <p className="text-yellow-400/70 text-sm mt-1">
                  Your seats are reserved temporarily
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
