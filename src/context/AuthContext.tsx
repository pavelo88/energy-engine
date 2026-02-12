'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import { getUsers, USER_ROLES } from '@/lib/data';
import { AdminLogin } from '@/app/admin/_components/AdminLogin';

const SESSION_STORAGE_KEY = 'assettrack_auth_token';

interface AuthContextType {
  user: User | null;
  users: User[];
  roles: UserRole[];
  setUserRole: (role: UserRole) => void;
  loading: boolean;
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (token === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Session storage is not available.');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
        setLoading(false);
        return;
    };
    
    const fetchUsers = async () => {
      setLoading(true);
      const users = await getUsers();
      setAllUsers(users);
      const adminUser = users.find(u => u.rol === 'admin');
      setCurrentUser(adminUser || users[0] || null);
      setLoading(false);
    };
    
    fetchUsers();
  }, [isAuthenticated]);

  const setUserRole = (role: UserRole) => {
    const newUser = allUsers.find(u => u.rol === role);
    if (newUser) {
      setCurrentUser(newUser);
    }
  };

  const login = useCallback(async (password: string): Promise<boolean> => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } catch (e) {
         console.error('Session storage is not available.');
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ user: currentUser, users: allUsers, roles: USER_ROLES, setUserRole, loading, isAuthenticated, login }}>
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
