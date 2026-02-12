'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { getUsers, USER_ROLES } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  users: User[];
  roles: UserRole[];
  setUserRole: (role: UserRole) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setAllUsers(users);
      // Set admin as default user on initial load
      const adminUser = users.find(u => u.rol === 'admin');
      setCurrentUser(adminUser || users[0] || null);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const setUserRole = (role: UserRole) => {
    const newUser = allUsers.find(u => u.rol === role);
    if (newUser) {
      setCurrentUser(newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, users: allUsers, roles: USER_ROLES, setUserRole, loading }}>
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
