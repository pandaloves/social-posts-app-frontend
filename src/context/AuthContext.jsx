import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, getUsers} from '../services/api';



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

    // Save tokens
    localStorage.setItem('token', response.token);

    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    // Fetch all users
    const users = await getUsers();

    // Find logged in user by username
    const matchedUser = users.find(
      user => user.username === username
    );

    if (!matchedUser) {
      return { success: false, error: 'User profile not found' };
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