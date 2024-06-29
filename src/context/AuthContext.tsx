import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const initialContext: AuthContextType = {
  isAdmin: false,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (email: string, password: string) => {
    // Replace with actual authentication logic
    if (email === 'admin@example.com' && password === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
