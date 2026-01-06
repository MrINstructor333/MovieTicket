import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Clock,
  Film,
  MapPin,
  DollarSign,
  Users,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const AdminShowForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [formData, setFormData] = useState({
    movie_id: '',
    theater_id: '',
    show_date: '',
    show_time: '',
    base_price: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMoviesAndTheaters();
    if (isEditing) {
      fetchShow();
    }
  }, [id]);

  const fetchMoviesAndTheaters = async () => {
    try {
      const [moviesRes, theatersRes] = await Promise.all([
        api.get('/movies/'),
        api.get('/theaters/'),
      ]);
      setMovies(moviesRes.data.results || moviesRes.data || []);
      setTheaters(theatersRes.data.results || theatersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load movies and theaters');
    }
  };

  const fetchShow = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/shows/${id}/`);
      const show = response.data;
      setFormData({
        movie_id: show.movie?.id || show.movie || '',
        theater_id: show.theater?.id || show.theater || '',
        show_date: show.show_date || '',
        show_time: show.show_time?.substring(0, 5) || '',
        base_price: show.base_price || '',
        is_active: show.is_active !== false,
      });
    } catch (error) {
      console.error('Failed to fetch show:', error);
      toast.error('Failed to load show details');
      navigate('/admin/shows');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.movie_id) newErrors.movie_id = 'Please select a movie';
    if (!formData.theater_id) newErrors.theater_id = 'Please select a theater';
    if (!formData.show_date) newErrors.show_date = 'Show date is required';
    if (!formData.show_time) newErrors.show_time = 'Show time is required';
    if (!formData.base_price) newErrors.base_price = 'Price is required';
    else if (parseFloat(formData.base_price) <= 0) newErrors.base_price = 'Price must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        movie: parseInt(formData.movie_id),
        theater: parseInt(formData.theater_id),
        show_date: formData.show_date,
        show_time: formData.show_time,
        base_price: parseFloat(formData.base_price),
        is_active: formData.is_active,
      };

      if (isEditing) {
        await api.put(`/shows/${id}/`, payload);
        toast.success('Show updated successfully');
      } else {
        await api.post('/shows/', payload);
        toast.success('Show created successfully');
      }
      navigate('/admin/shows');
    } catch (error) {
      console.error('Failed to save show:', error);
      const errorMsg = error.response?.data?.detail || 
                       Object.values(error.response?.data || {}).flat().join(', ') || 
                       'Failed to save show';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectedMovie = movies.find(m => m.id === parseInt(formData.movie_id));
  const selectedTheater = theaters.find(t => t.id === parseInt(formData.theater_id));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-dark-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/shows')}
            className="neu-icon-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? 'Edit Show' : 'Add New Show'}
            </h1>
            <p className="text-gray-400 mt-1">
              {isEditing ? 'Update show details' : 'Schedule a new movie show'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bento-card p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              Show Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Movie Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Movie *
                </label>
                <select
                  name="movie_id"
                  value={formData.movie_id}
                  onChange={handleChange}
                  className={`neu-select w-full ${errors.movie_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.duration} min)
                    </option>
                  ))}
                </select>
                {errors.movie_id && (
                  <p className="mt-1 text-sm text-red-400">{errors.movie_id}</p>
                )}
              </div>

              {/* Theater Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theater *
                </label>
                <select
                  name="theater_id"
                  value={formData.theater_id}
                  onChange={handleChange}
                  className={`neu-select w-full ${errors.theater_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a theater</option>
                  {theaters.map(theater => (
                    <option key={theater.id} value={theater.id}>
                      {theater.name} ({theater.total_seats} seats)
                    </option>
                  ))}
                </select>
                {errors.theater_id && (
                  <p className="mt-1 text-sm text-red-400">{errors.theater_id}</p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="is_active"
                  value={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="neu-select w-full"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Show Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Show Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    name="show_date"
                    value={formData.show_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`neu-input-admin w-full pl-12 ${errors.show_date ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.show_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.show_date}</p>
                )}
              </div>

              {/* Show Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Show Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="time"
                    name="show_time"
                    value={formData.show_time}
                    onChange={handleChange}
                    className={`neu-input-admin w-full pl-12 ${errors.show_time ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.show_time && (
                  <p className="mt-1 text-sm text-red-400">{errors.show_time}</p>
                )}
              </div>

              {/* Price */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticket Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="15.00"
                    className={`neu-input-admin w-full pl-12 ${errors.base_price ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.base_price && (
                  <p className="mt-1 text-sm text-red-400">{errors.base_price}</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {(selectedMovie || selectedTheater || formData.show_date || formData.show_time) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bento-card p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Show Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedMovie && (
                  <div className="p-3 bg-dark-800 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Movie</p>
                    <p className="text-white font-medium truncate">{selectedMovie.title}</p>
                    <p className="text-xs text-gray-500">{selectedMovie.duration} min</p>
                  </div>
                )}
                {selectedTheater && (
                  <div className="p-3 bg-dark-800 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Theater</p>
                    <p className="text-white font-medium">{selectedTheater.name}</p>
                    <p className="text-xs text-gray-500">{selectedTheater.total_seats} seats</p>
                  </div>
                )}
                {formData.show_date && (
                  <div className="p-3 bg-dark-800 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Date</p>
                    <p className="text-white font-medium">
                      {new Date(formData.show_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {formData.show_time && (
                  <div className="p-3 bg-dark-800 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Time</p>
                    <p className="text-white font-medium">
                      {(() => {
                        const [hours, minutes] = formData.show_time.split(':');
                        const hour = parseInt(hours);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        return `${hour12}:${minutes} ${ampm}`;
                      })()}
                    </p>
                  </div>
                )}
              </div>
              {selectedMovie && selectedTheater && formData.show_time && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-sm text-amber-300">
                    <strong>Estimated End Time:</strong>{' '}
                    {(() => {
                      const [hours, minutes] = formData.show_time.split(':');
                      const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
                      const endMinutes = startMinutes + selectedMovie.duration;
                      const endHours = Math.floor(endMinutes / 60) % 24;
                      const endMins = endMinutes % 60;
                      const ampm = endHours >= 12 ? 'PM' : 'AM';
                      const hour12 = endHours % 12 || 12;
                      return `${hour12}:${endMins.toString().padStart(2, '0')} ${ampm}`;
                    })()}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/shows')}
              className="neu-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="neu-button-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? 'Update Show' : 'Create Show'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminShowForm;
