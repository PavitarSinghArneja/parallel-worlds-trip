import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('parallel-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Create guest user for demo
      const guestUser = {
        id: 'guest-' + Math.random().toString(36).substr(2, 9),
        name: 'Explorer',
        points: 0
      };
      setUser(guestUser);
      localStorage.setItem('parallel-user', JSON.stringify(guestUser));
    }
  }, []);

  const login = (userData: Partial<User>) => {
    const newUser = { ...user, ...userData } as User;
    setUser(newUser);
    localStorage.setItem('parallel-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parallel-user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('parallel-user', JSON.stringify(updatedUser));
    }
  };

  const addPoints = (points: number) => {
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      setUser(updatedUser);
      localStorage.setItem('parallel-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, addPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};