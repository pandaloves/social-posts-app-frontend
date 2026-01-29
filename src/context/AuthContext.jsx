import { createContext, useContext, useState, useEffect } from 'react';
import { authService, getUsers } from '../services/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user and token on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          clearAuthData();
        }
      }
    }
    setIsLoading(false);
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      // If backend returns a user object
      if (response.id) {
        const newUser = {
          id: response.id,
          username: response.username,
          email: response.email,
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authService.login({ username, password });

      if (!response.token) {
        return { success: false, error: 'Invalid response from server' };
      }

      // Save tokens (trimmed)
      localStorage.setItem('token', response.token.trim());
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken.trim());
      }

      // Fetch all users
      let users;
      try {
        users = await getUsers();
      } catch (error) {
        console.error('Failed to fetch users list:', error);
        // Even if fetching users fails, we might still be logged in
        // Create a minimal user object from the login response
        if (response.user) {
          const loggedInUser = {
            id: response.user.id || response.id,
            username: response.user.username || username,
            email: response.user.email || '',
          };
          
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
          return { success: true };
        }
        
        return { 
          success: false, 
          error: 'Login successful but failed to load user profile. Please refresh the page.' 
        };
      }

      // Defensive check
      if (!users || users.length === 0) {
        return { success: false, error: 'No users found' };
      }

      // Find logged in user by username
      const matchedUser = users.find(
        user => user.username && user.username.trim().toLowerCase() === username.trim().toLowerCase()
      );

      if (!matchedUser) {
        console.log('Available users:', users.map(u => u.username));
        return { success: false, error: `User profile not found. Username: ${username}` };
      }

      const loggedInUser = {
        id: matchedUser.id,
        username: matchedUser.username,
        email: matchedUser.email,
      };

      // Save user
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return { success: true };

    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    clearAuthData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}