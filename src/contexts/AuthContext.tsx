/**
 * Authentication Context
 * Manages user authentication state and login/logout functionality
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  phoneNumber: string;
  email: string;
  role: string;
  name?: string;
  userName?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('admin_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (phoneNumber: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // API call to authentication endpoint
      const response = await fetch('http://161.97.100.109:7001/api/Account/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PhoneNumber: phoneNumber,
          password: password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Login API response:', responseData);
        
        // Extract user data from nested structure
        const userData = responseData.user || responseData;
        console.log('Extracted user data:', userData);
        
        // Create user object from response
        const user: User = {
          id: userData.id || userData.userId || '1',
          phoneNumber: userData.phoneNumber || userData.userName || phoneNumber,
          email: userData.email || '',
          role: userData.role || (userData.roles && userData.roles.length > 0 ? userData.roles[0] : 'admin'),
          name: userData.name || userData.fullName || userData.userName || phoneNumber,
          userName: userData.userName,
          roles: userData.roles,
        };

        console.log('Created user object:', user);
        console.log('User ID being used:', user.id);
        console.log('User ID type:', typeof user.id);

        // Store user in localStorage
        localStorage.setItem('admin_user', JSON.stringify(user));
        setUser(user);
        console.log('User stored and state updated');
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed:', response.status, response.statusText, errorData);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user...');
    localStorage.removeItem('admin_user');
    setUser(null);
    console.log('AuthContext: User logged out, localStorage cleared');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
