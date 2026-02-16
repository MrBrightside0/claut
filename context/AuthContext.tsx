import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { db } from '../services/mockDb';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const storedUserId = localStorage.getItem('claut_session_user_id');
    if (storedUserId) {
      const found = db.users.find(u => u.id === storedUserId);
      if (found) {
        // Double check active status even on session restore
        if (found.companyId) {
            const company = db.getCompanyById(found.companyId);
            if (company && !company.isActive) {
               logout();
               setIsLoading(false);
               return;
            }
        }
        setUser(found);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    
    const result = db.login(email, password);
    
    if (result.user) {
      setUser(result.user);
      localStorage.setItem('claut_session_user_id', result.user.id);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('claut_session_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};