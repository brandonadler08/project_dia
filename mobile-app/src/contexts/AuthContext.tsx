import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';
import { getToken, removeToken } from '../services/auth';

interface AuthContextData {
  user: Usuario | null;
  loading: boolean;
  login: (userData: Usuario) => void;
  logout: () => Promise<void>;
  checkToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await getToken();
      if (token) {
        // En una app real, aquí validaríamos el token con el backend
        // o decodificaríamos el JWT para obtener los datos del usuario.
        // Por ahora, simulamos un usuario si hay token.
        setUser({
          id: 1,
          nombre: 'Gestor de Campo',
          email: 'gestor@demo.com',
          rol: 'GESTOR',
          numero_comisionista: 'GST-001'
        });
      }
    } catch (error) {
      console.error('Error verificando token:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: Usuario) => {
    setUser(userData);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
