/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const TOKEN_STORAGE_KEY = 'authToken';
const AUTH_EXPIRED_EVENT = 'auth:expired';

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

      if (isMounted) {
        setIsLoading(true);
      }

      try {
        const profile = await authApi.getProfile();
        if (isMounted) {
          setUser(profile?.user || profile);
        }
      } catch (error) {
        if (isMounted) {
          const status = error?.response?.status;

          if (status === 401 || status === 403) {
            console.warn('[Auth] Session invalid (401/403). Clearing token.');
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setToken(null);
            setUser(null);
          } else {
            // Keep the token for transient/network/backend-profile-endpoint issues.
            console.warn('[Auth] Profile check failed without auth error. Keeping token.', error);
          }
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

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== TOKEN_STORAGE_KEY) {
        return;
      }

      const nextToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      setToken(nextToken);

      if (!nextToken) {
        setUser(null);
      }
    };

    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    const authToken = data?.token || data?.access_token || data?.data?.token || data?.data?.access_token;

    if (!authToken) {
      throw new Error('Authentication token was not returned by the server.');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    setToken(authToken);
    setUser(data?.user || null);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
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
