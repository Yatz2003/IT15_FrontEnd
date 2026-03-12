/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import loginAPI from '../services/loginAPI';

const TOKEN_STORAGE_KEY = 'authToken';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!token) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const profile = await loginAPI.getProfile();
        if (isMounted) {
          setUser(profile?.user || profile);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await loginAPI.login(email, password);
    const authToken = data?.token || data?.access_token;

    if (!authToken) {
      throw new Error('Authentication token was not returned by the server.');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    setToken(authToken);
    setUser(data?.user || null);
    return data;
  };

  const logout = async () => {
    await loginAPI.logout();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
