import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, 
  Home, 
  Ticket, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PlusCircle,
  Users,
  BarChart3,
  Calendar,
  Settings,
  CreditCard,
  Heart,
  Clock,
  HelpCircle,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isAdmin = false, isMobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Always expanded on mobile (overlay mode)
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  // Customer navigation items
  const customerNavItems = [
    { 
      section: 'Main',
      items: [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Movies', path: '/movies', icon: Film },
        { name: 'My Bookings', path: '/bookings', icon: Ticket },
      ]
    },
    {
      section: 'Account',
      items: [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Payment Methods', path: '/payment-methods', icon: CreditCard },
        { name: 'Favorites', path: '/favorites', icon: Heart },
        { name: 'Watch History', path: '/history', icon: Clock },
      ]
    },
    {
      section: 'Support',
      items: [
        { name: 'Notifications', path: '/notifications', icon: Bell },
        { name: 'Help & Support', path: '/support', icon: HelpCircle },
      ]
    }
  ];

  // Admin navigation items
  const adminNavItems = [
    {
      section: 'Dashboard',
      items: [
        { name: 'Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      section: 'Content Management',
      items: [
        { name: 'Movies', path: '/admin/movies', icon: Film },
        { name: 'Add Movie', path: '/admin/movies/new', icon: PlusCircle },
        { name: 'Shows', path: '/admin/shows', icon: Calendar },
        { name: 'Add Show', path: '/admin/shows/new', icon: PlusCircle },
      ]
    },
    {
      section: 'Management',
      items: [
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
        { name: 'Payments', path: '/admin/payments', icon: CreditCard },
      ]
    },
    {
      section: 'System',
      items: [
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  const handleLogout = async () => {
    await logout();
  };

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 }
  };

  const mobileSidebarVariants = {
    open: { x: 0 },
    closed: { x: -300 }
  };

  const NavItem = ({ item, isActive }) => (
    <Link to={item.path} onClick={isMobile ? onMobileClose : undefined}>
      <motion.div
        className={`
          flex items-center gap-3 px-4 py-3 mx-2 rounded-xl cursor-pointer
          transition-all duration-300
          ${isActive 
            ? 'neu-sidebar-item-active' 
            : 'neu-sidebar-item'
          }
        `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-accent-cyan' : ''}`} />
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-medium text-sm whitespace-nowrap overflow-hidden"
            >
              {item.name}
            </motion.span>
          )}
        </AnimatePresence>
        {isActive && (!isCollapsed || isMobile) && (
          <motion.div
            layoutId="activeIndicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan"
          />
        )}
      </motion.div>
    </Link>
  );

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan 
                       flex items-center justify-center flex-shrink-0"
          >
            <Film className="w-6 h-6 text-white" />
          </motion.div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold gradient-text">CinemaHub</span>
                <span className="text-xs text-gray-500">
                  {isAdmin ? 'Admin Panel' : 'Customer Portal'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="neu-sidebar-close p-2 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Collapse Toggle - Desktop only */}
      {!isMobile && (
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="neu-sidebar-toggle absolute -right-3 top-20 w-6 h-6 rounded-full
                     flex items-center justify-center z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </motion.button>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        {navItems.map((section, idx) => (
          <div key={section.section} className={idx > 0 ? 'mt-6' : ''}>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {section.section}
                </motion.h3>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/5">
        <div className={`flex items-center gap-3 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="neu-sidebar-avatar w-10 h-10 rounded-xl
                          flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className={`
            neu-sidebar-logout mt-4 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
            ${isCollapsed && !isMobile ? 'justify-center' : ''}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );

  // Mobile: Overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-[280px] z-50 flex flex-col
                         bg-dark-900/98 backdrop-blur-xl
                         border-r border-white/5 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 top-0 h-screen z-40 flex-col
                 bg-dark-900/95 backdrop-blur-xl
                 border-r border-white/5
                 hidden lg:flex"
    >
      <SidebarContent />
    </motion.aside>
  );
};

// Mobile Menu Toggle Button Component
export const MobileMenuButton = ({ onClick, isOpen }) => (
  <button
    onClick={onClick}
    className="neu-sidebar-toggle lg:hidden p-2 rounded-xl"
    aria-label="Toggle menu"
  >
    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
);

export default Sidebar;
