import React, { createContext, useState, useEffect } from 'react';
import { getUserSession, storeUserSession, clearUserSession } from '../store/useAuthStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al abrir la app, revisamos si ya había alguien logueado en AsyncStorage
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const session = await getUserSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false); // Terminamos de cargar
  };

  // Función que llamarás desde tu pantalla de Login
  const login = async (userData) => {
    await storeUserSession(userData);
    setUser(userData); // Esto fuerza a React a cambiar a los Tabs
  };

  // Función que llamarás desde tu pantalla de Cuenta para salir
  const logout = async () => {
    await clearUserSession();
    setUser(null); // Esto fuerza a React a mostrar el Login
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};