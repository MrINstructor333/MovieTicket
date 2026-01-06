import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import {
  Home,
  Movies,
  MovieDetail,
  SeatSelection,
  Payment,
  BookingConfirmation,
  MyBookings,
  Login,
  Register,
  Profile,
  NotFound,
} from './pages';
import {
  AdminDashboard,
  AdminMovies,
  AdminMovieForm,
  AdminShows,
  AdminShowForm,
  AdminUsers,
  AdminBookings,
  AdminPayments,
  AdminAnalytics,
  AdminSettings,
} from './pages/admin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="movies" element={<Movies />} />
              <Route path="movies/:id" element={<MovieDetail />} />
              <Route path="booking/:showId" element={<SeatSelection />} />
              <Route path="payment/:bookingId" element={<Payment />} />
              <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin routes with AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="movies/new" element={<AdminMovieForm />} />
              <Route path="movies/edit/:id" element={<AdminMovieForm />} />
              <Route path="shows" element={<AdminShows />} />
              <Route path="shows/new" element={<AdminShowForm />} />
              <Route path="shows/edit/:id" element={<AdminShowForm />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Auth routes without main layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
