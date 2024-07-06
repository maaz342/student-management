import React, { createContext, useContext, useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase'; // Adjust the import path as per your project structure
import { ref, get } from 'firebase/database';

interface AuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialContext: AuthContextType = {
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(initialContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    if (email === 'admin@example.com' && password === 'admin') {
      setIsAdmin(true);
      return;
    }

    try {
      const teacherRef = ref(database, 'teachers/' + email.replace('.', '_'));
      const snapshot = await get(teacherRef);
      const teacher = snapshot.val();

      if (teacher && teacher.password === password) {
        setIsAdmin(true); // Log in as admin
        return;
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }

    // If not admin or teacher, try Firebase Authentication
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(false); // Log in as regular user
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    setIsAdmin(false);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
