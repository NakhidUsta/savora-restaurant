import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest, logout as logoutRequest, me as meRequest } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Səhifə yenilənəndə (F5) httpOnly cookie hələ də brauzerdədirsə, sessiyanı bərpa edirik.
    meRequest()
      .then((data) => setAdmin(data.admin))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, isAuthenticated: Boolean(admin), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() yalnız AuthProvider daxilində istifadə oluna bilər');
  }
  return ctx;
}
