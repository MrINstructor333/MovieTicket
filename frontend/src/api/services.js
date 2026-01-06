import api from './axios';

// Auth Services
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout/', { refresh: refreshToken });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile/', userData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password/', passwordData);
    return response.data;
  },
};

// Movie Services
export const movieService = {
  getAll: async (params = {}) => {
    const response = await api.get('/movies/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/movies/${id}/`);
    return response.data;
  },
  
  getNowShowing: async () => {
    const response = await api.get('/movies/', { params: { status: 'NOW_SHOWING' } });
    return response.data;
  },
  
  getUpcoming: async () => {
    const response = await api.get('/movies/', { params: { status: 'COMING_SOON' } });
    return response.data;
  },
  
  search: async (query) => {
    const response = await api.get('/movies/', { params: { search: query } });
    return response.data;
  },
};

// Theater Services
export const theaterService = {
  getAll: async () => {
    const response = await api.get('/theaters/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/theaters/${id}/`);
    return response.data;
  },
};

// Show Services
export const showService = {
  getAll: async (params = {}) => {
    const response = await api.get('/shows/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/shows/${id}/`);
    return response.data;
  },
  
  getByMovie: async (movieId) => {
    const response = await api.get('/shows/', { params: { movie: movieId } });
    return response.data;
  },
  
  getSeats: async (showId) => {
    // Get seat availability for a specific show
    const response = await api.get(`/shows/${showId}/seats/`);
    return response.data;
  },
};

// Seat Services
export const seatService = {
  getByTheater: async (theaterId) => {
    const response = await api.get('/seats/', { params: { theater: theaterId } });
    return response.data;
  },
  
  getByShow: async (showId) => {
    const response = await api.get('/seats/', { params: { show: showId } });
    return response.data;
  },
};

// Booking Services
export const bookingService = {
  create: async (bookingData) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },
  
  getMyBookings: async () => {
    // The backend filters bookings by authenticated user automatically
    const response = await api.get('/bookings/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },
  
  cancel: async (id, reason = '') => {
    const response = await api.post(`/bookings/${id}/cancel/`, { reason });
    return response.data;
  },
};

// Payment Services
export const paymentService = {
  process: async (paymentData) => {
    const response = await api.post('/payments/process/', paymentData);
    return response.data;
  },
  
  getByBooking: async (bookingId) => {
    const response = await api.get('/payments/', { params: { booking: bookingId } });
    return response.data;
  },
};

// Admin Services
export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard/');
    return response.data;
  },
  
  getUsers: async () => {
    const response = await api.get('/admin/users/');
    return response.data;
  },
  
  getAllBookings: async () => {
    const response = await api.get('/bookings/');
    return response.data;
  },
  
  getAllMovies: async () => {
    const response = await api.get('/movies/');
    return response.data;
  },
  
  createMovie: async (movieData) => {
    const response = await api.post('/movies/', movieData);
    return response.data;
  },
  
  updateMovie: async (id, movieData) => {
    const response = await api.put(`/movies/${id}/`, movieData);
    return response.data;
  },
  
  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}/`);
    return response.data;
  },
  
  createShow: async (showData) => {
    const response = await api.post('/shows/', showData);
    return response.data;
  },
  
  updateShow: async (id, showData) => {
    const response = await api.put(`/shows/${id}/`, showData);
    return response.data;
  },
  
  deleteShow: async (id) => {
    const response = await api.delete(`/shows/${id}/`);
    return response.data;
  },
};
