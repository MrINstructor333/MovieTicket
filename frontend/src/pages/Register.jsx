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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Enhanced Background Effects with Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        
        {/* Animated orbs for depth */}
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '-10%',
            right: '-10%',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
            bottom: '-20%',
            left: '-15%',
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
            top: '40%',
            left: '60%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glass Modal Container with enhanced glow */}
        <motion.div 
          className="glass-modal p-8 relative"
          initial={{ boxShadow: '0 0 0 rgba(124, 58, 237, 0)' }}
          animate={{ 
            boxShadow: [
              '0 0 40px rgba(124, 58, 237, 0.1)',
              '0 0 60px rgba(124, 58, 237, 0.15)',
              '0 0 40px rgba(124, 58, 237, 0.1)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center relative"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Logo glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent-cyan blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                <Film className="w-7 h-7 text-white relative z-10" />
              </motion.div>
              <span className="text-2xl font-bold gradient-text">CinemaHub</span>
            </Link>
            <motion.h1 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Create Account
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Join us for the best cinema experience
            </motion.p>
          </div>

          {/* Form with Neumorphic Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
          <p className="text-center text-gray-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
