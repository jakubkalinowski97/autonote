import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the context data
interface AuthContextData {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextData | null>(null);

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  // In a real app, you'd check for a token in secure storage here
  // For now, we'll just start as logged out.

  const login = (email: string) => {
    // In a real app, this would be called after a successful API call
    console.log('User logged in');
    setUser({ email });
    setAuthenticated(true);
  };

  const logout = () => {
    // Clear token from storage, etc.
    console.log('User logged out');
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 