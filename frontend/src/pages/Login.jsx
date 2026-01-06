import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input, GlassCard, Checkbox } from '../components/ui';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from || '/';

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
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.username, formData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.detail || error.response?.data?.error || 'Invalid credentials';
      toast.error(message);
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
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.25) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '-10%',
            left: '-10%',
          }}
          animate={{
            x: [0, 30, 0],
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
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
            bottom: '-20%',
            right: '-15%',
          }}
          animate={{
            x: [0, -40, 0],
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
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10,
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
          initial={{ boxShadow: '0 0 0 rgba(0, 212, 255, 0)' }}
          animate={{ 
            boxShadow: [
              '0 0 40px rgba(0, 212, 255, 0.1)',
              '0 0 60px rgba(0, 212, 255, 0.15)',
              '0 0 40px rgba(0, 212, 255, 0.1)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center relative"
                whileHover={{ scale: 1.05, rotate: 5 }}
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
              Welcome Back
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Sign in to continue booking
            </motion.p>
          </div>

          {/* Form with Neumorphic Inputs */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon={Mail}
              variant="neumorphic"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              variant="neumorphic"
            />

            <div className="flex items-center justify-between text-sm">
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember me"
                size="sm"
              />
              <Link to="/forgot-password" className="text-accent-cyan hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-800/50 text-gray-400 rounded-lg">Or continue with</span>
            </div>
          </div>

          {/* Social Login - Neumorphic Style */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              className="neu-button flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </motion.button>
            <motion.button 
              className="neu-button flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </motion.button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-cyan font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
