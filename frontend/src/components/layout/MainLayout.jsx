import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex bg-dark-900">
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
      
      {/* Sidebar - only show when authenticated */}
      {isAuthenticated && <Sidebar isAdmin={false} />}
      
      {/* Main Content */}
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ${
          isAuthenticated ? 'ml-[260px]' : ''
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
