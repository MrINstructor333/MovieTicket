import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Menu, Film } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-dark-900">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-dark-800/95 !text-white !border !border-white/10',
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f1f33',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f1f33',
            },
          },
        }}
      />
      
      {/* Admin Sidebar */}
      <Sidebar 
        isAdmin={true} 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <main className={`
        flex-1 min-h-screen transition-all duration-300
        ${!isMobile ? 'lg:ml-[260px]' : ''}
      `}>
        {/* Mobile Header Bar */}
        {isMobile && (
          <div className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 
                          bg-dark-900/95 backdrop-blur-xl border-b border-white/5">
            <motion.button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-dark-800 border border-white/10
                         text-gray-400 hover:text-white hover:border-accent-cyan/50
                         transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-cyan 
                              flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Admin Panel</span>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
