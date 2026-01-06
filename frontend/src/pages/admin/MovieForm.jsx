import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Film,
  Calendar,
  Clock,
  Star,
  Image,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { movieService, adminService } from '../../api/services';

const MovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetchingMovie, setFetchingMovie] = useState(isEditing);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    language: 'English',
    release_date: '',
    rating: 'PG',
    poster_url: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const movie = await movieService.getById(id);
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        genre: movie.genre || '',
        duration: movie.duration || '',
        language: movie.language || 'English',
        release_date: movie.release_date || '',
        rating: movie.rating || 'PG',
        poster_url: movie.poster_url || '',
        is_active: movie.is_active !== false,
      });
    } catch (error) {
      console.error('Error fetching movie:', error);
      toast.error('Failed to fetch movie');
      navigate('/admin/movies');
    } finally {
      setFetchingMovie(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.language.trim()) newErrors.language = 'Language is required';
    if (!formData.release_date) newErrors.release_date = 'Release date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre.toLowerCase(),
        duration: parseInt(formData.duration),
        language: formData.language,
        release_date: formData.release_date,
        rating: formData.rating || 'PG',
        poster_url: formData.poster_url || null,
        is_active: formData.is_active,
      };

      if (isEditing) {
        await adminService.updateMovie(id, submitData);
        toast.success('Movie updated successfully');
      } else {
        await adminService.createMovie(submitData);
        toast.success('Movie created successfully');
      }
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error saving movie:', error);
      const errorMsg = error.response?.data?.detail || 
                       Object.values(error.response?.data || {}).flat().join(', ') || 
                       'Failed to save movie';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-dark-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <button
          onClick={() => navigate('/admin/movies')}
          className="neu-icon-button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'Edit Movie' : 'Add New Movie'}
          </h1>
          <p className="text-gray-400 mt-1">
            {isEditing ? 'Update movie information' : 'Add a new movie to your catalog'}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bento-card p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" />
                Basic Information
              </h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter movie title"
                    className={`neu-input-admin w-full ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter movie description"
                    rows={4}
                    className="neu-textarea w-full"
                  />
                </div>

                {/* Genre & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Genre *
                    </label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className={`neu-select w-full ${errors.genre ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select genre</option>
                      <option value="action">Action</option>
                      <option value="comedy">Comedy</option>
                      <option value="drama">Drama</option>
                      <option value="horror">Horror</option>
                      <option value="romance">Romance</option>
                      <option value="sci-fi">Science Fiction</option>
                      <option value="thriller">Thriller</option>
                      <option value="animation">Animation</option>
                      <option value="documentary">Documentary</option>
                      <option value="adventure">Adventure</option>
                    </select>
                    {errors.genre && <p className="mt-1 text-sm text-red-400">{errors.genre}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="120"
                        className={`neu-input-admin w-full pl-12 ${errors.duration ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.duration && <p className="mt-1 text-sm text-red-400">{errors.duration}</p>}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language *
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="e.g., English, Spanish"
                    className={`neu-input-admin w-full ${errors.language ? 'border-red-500' : ''}`}
                  />
                  {errors.language && <p className="mt-1 text-sm text-red-400">{errors.language}</p>}
                </div>

                {/* Release Date & Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Release Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                      <input
                        type="date"
                        name="release_date"
                        value={formData.release_date}
                        onChange={handleChange}
                        className={`neu-input-admin w-full pl-12 ${errors.release_date ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.release_date && <p className="mt-1 text-sm text-red-400">{errors.release_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="neu-select w-full"
                    >
                      <option value="G">G - General Audiences</option>
                      <option value="PG">PG - Parental Guidance</option>
                      <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                      <option value="R">R - Restricted</option>
                      <option value="NC-17">NC-17 - Adults Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bento-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
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

            {/* Media */}
            <div className="bento-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Poster
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Poster URL
                  </label>
                  <input
                    type="url"
                    name="poster_url"
                    value={formData.poster_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="neu-input-admin w-full text-sm"
                  />
                </div>

                {/* Poster Preview */}
                {formData.poster_url && (
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-800">
                    <img
                      src={formData.poster_url}
                      alt="Poster preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="neu-button-primary w-full flex items-center justify-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? 'Update Movie' : 'Create Movie'}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default MovieForm;
