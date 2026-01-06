import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  Home, 
  Ticket, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ showMenuButton, onMenuClick, isMobileSidebarOpen }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'My Bookings', path: '/bookings', icon: Ticket, auth: true },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass-navbar sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button + Logo */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button for authenticated customers on mobile */}
            {showMenuButton && (
              <motion.button
                onClick={onMenuClick}
                className="lg:hidden p-2.5 rounded-xl neu-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            )}

            {/* Logo with enhanced glow */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center relative"
              >
                {/* Soft ambient glow */}
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent-cyan"
                  initial={{ filter: 'blur(8px)', opacity: 0.4 }}
                  animate={{ 
                    filter: ['blur(8px)', 'blur(12px)', 'blur(8px)'],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <Film className="w-6 h-6 text-white relative z-10" />
              </motion.div>
              <motion.span 
                className="text-xl font-bold gradient-text hidden sm:block"
                whileHover={{ scale: 1.02 }}
              >
                CinemaHub
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-primary/20 text-accent-cyan shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar - Neumorphic Style */}
          <form onSubmit={handleSearch} className="hidden lg:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 rounded-xl
                           text-white placeholder-gray-400 
                           bg-gradient-to-br from-[#142235] to-[#0f1a2a]
                           shadow-[inset_3px_3px_6px_#0a1525,inset_-3px_-3px_6px_#1e3a5f]
                           focus:outline-none focus:shadow-[inset_3px_3px_6px_#0a1525,inset_-3px_-3px_6px_#1e3a5f,0_0_0_2px_rgba(0,212,255,0.3)]
                           transition-all duration-300"
              />
            </div>
          </form>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                               text-accent-purple hover:bg-accent-purple/10 transition-all
                               hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="font-medium">Admin</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                             text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.username}</span>
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                             text-red-400 hover:bg-red-500/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="inline-block px-6 py-2.5 neu-button-primary rounded-xl
                               text-white font-semibold"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Neumorphic */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl neu-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Glass Sidebar Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-sidebar border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search - Neumorphic */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl neu-input"
                  />
                </div>
              </form>

              {/* Mobile Nav Links */}
              {navLinks.map((link) => {
                if (link.auth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                               text-gray-300 hover:text-accent-cyan hover:bg-white/5 transition-all"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl
                                   text-accent-purple hover:bg-accent-purple/10 transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl
                                 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">{user?.username}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                                 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 text-center neu-button rounded-xl"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 text-center neu-button-primary rounded-xl
                                 text-white font-semibold"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
