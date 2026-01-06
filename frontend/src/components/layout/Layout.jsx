import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar, { MobileMenuButton } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { isAuthenticated, isAdmin } = useAuth();
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

  // Don't show sidebar for admin users (they use AdminLayout) or unauthenticated users
  const showSidebar = isAuthenticated && !isAdmin;

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-card !bg-dark-800/90 !text-white',
          success: {
            iconTheme: {
              primary: '#00d4ff',
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
      
      {/* Customer Sidebar - only show when authenticated and not admin */}
      {showSidebar && (
        <Sidebar 
          isAdmin={false} 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Main Content Area */}
      <div className={`
        flex flex-col flex-1 transition-all duration-300
        ${showSidebar && !isMobile ? 'lg:ml-[260px]' : ''}
      `}>
        <Navbar 
          showMenuButton={showSidebar && isMobile}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
