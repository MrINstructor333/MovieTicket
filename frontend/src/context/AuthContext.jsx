import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        try {
          // Try to get fresh user data from API
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          // If API call fails, try to use stored user data
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
            } catch {
              // Clear invalid data
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
            }
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    // Backend returns { user, tokens: { access, refresh } }
    const { user: userData, tokens } = response;
    
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    // Backend returns { user, tokens: { access, refresh } }
    const { user: newUser, tokens } = response;
    
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setUser(newUser);
    setIsAuthenticated(true);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors
      console.log('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  };

  const updateProfile = async (userData) => {
    const updatedUser = await authService.updateProfile(userData);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin' || user?.is_staff || false,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
