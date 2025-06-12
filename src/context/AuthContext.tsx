// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Session duration in milliseconds (24 hours)
  const SESSION_DURATION = 24 * 60 * 60 * 1000;

  // Use useCallback to prevent recreation of logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('session_expiry');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Check for existing session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const sessionExpiry = localStorage.getItem('session_expiry');
        
        if (storedUser && sessionExpiry) {
          const userData = JSON.parse(storedUser);
          const expiryTime = parseInt(sessionExpiry);
          const currentTime = Date.now();
          
          if (currentTime < expiryTime) {
            // Session is still valid
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('session_expiry');
          }
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('session_expiry');
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Check session expiry periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionExpiry = () => {
      const sessionExpiry = localStorage.getItem('session_expiry');
      if (sessionExpiry) {
        const expiryTime = parseInt(sessionExpiry);
        const currentTime = Date.now();
        
        if (currentTime >= expiryTime) {
          logout();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, logout]); // Now logout is properly included in dependencies

  const login = (userData: any) => {
    const expiryTime = Date.now() + SESSION_DURATION;
    
    // Store user data and expiry time in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('session_expiry', expiryTime.toString());
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}