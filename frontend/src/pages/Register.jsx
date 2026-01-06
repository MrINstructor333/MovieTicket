import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, UserPlus, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Checkbox } from '../components/ui';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Passwords do not match';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!agreeTerms) newErrors.terms = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const formattedErrors = {};
        Object.keys(apiErrors).forEach(key => {
          formattedErrors[key] = Array.isArray(apiErrors[key]) 
            ? apiErrors[key][0] 
            : apiErrors[key];
        });
        setErrors(formattedErrors);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-md"
      >
        {/* Glass Modal Container with subtle glow */}
        <motion.div 
          className="glass-modal p-5 sm:p-8"
          initial={{ boxShadow: '0 0 30px rgba(124, 58, 237, 0.1)' }}
          whileHover={{ boxShadow: '0 0 50px rgba(124, 58, 237, 0.15)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="text-center mb-5 sm:mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6 group">
              <motion.div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-cyan opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <Film className="w-5 h-5 sm:w-7 sm:h-7 text-white relative z-10" />
              </motion.div>
              <motion.span 
                className="text-xl sm:text-2xl font-bold gradient-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                CinemaHub
              </motion.span>
            </Link>
            <motion.h1 
              className="text-xl sm:text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create Account
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join us for the best cinema experience
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="First Name"
                name="first_name"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                variant="neumorphic"
              />
              <Input
                label="Last Name"
                name="last_name"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                variant="neumorphic"
              />
            </div>

            <Input
              label="Username"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={User}
              variant="neumorphic"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              variant="neumorphic"
            />

            <Input
              label="Phone Number"
              name="phone"
              placeholder="0712345678"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={Phone}
              variant="neumorphic"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              variant="neumorphic"
            />

            <Input
              label="Confirm Password"
              name="password_confirm"
              type="password"
              placeholder="Confirm your password"
              value={formData.password_confirm}
              onChange={handleChange}
              error={errors.password_confirm}
              icon={Lock}
              variant="neumorphic"
            />

            <div className="flex items-start gap-3">
              <Checkbox
                checked={agreeTerms}
                onChange={setAgreeTerms}
                size="sm"
              />
              <label className="text-sm text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-accent-cyan hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-accent-cyan hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-400">{errors.terms}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={UserPlus}
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <motion.p 
            className="text-center text-gray-400 mt-6 sm:mt-8 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan font-medium hover:underline">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
