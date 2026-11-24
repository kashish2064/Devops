import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth as authApi, setToken, clearToken, getToken } from '@/api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data: any) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data: any = await authApi.login(email, password);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data: any = await authApi.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
