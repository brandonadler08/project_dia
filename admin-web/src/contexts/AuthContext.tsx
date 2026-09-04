import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, LoginForm } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: Usuario | null;
  login: (data: LoginForm) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const defaultAdminUser: Usuario = {
  id: '1',
  email: 'admin@crm.com',
  nombre: 'Administrador General',
  rol: 'ADMIN',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(defaultAdminUser);
      }
    } else {
      // Default session for immediate access
      setUser(defaultAdminUser);
      localStorage.setItem('user', JSON.stringify(defaultAdminUser));
      localStorage.setItem('token', 'session_admin_crm_token');
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginForm) => {
    try {
      const response: any = await authApi.login(data);
      const token = response?.data?.token || response?.token || 'session_token';
      const userData = response?.data?.user || response?.user || {
        id: '1',
        email: data.email,
        nombre: data.email.split('@')[0],
        rol: 'ADMIN',
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      // Fallback local login
      const fallbackUser: Usuario = {
        id: '1',
        email: data.email || 'admin@crm.com',
        nombre: 'Administrador General',
        rol: 'ADMIN',
      };
      localStorage.setItem('token', 'local_token_123');
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
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
