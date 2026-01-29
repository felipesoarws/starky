import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

import { API_URL } from "../config";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean; message?: string }>;
  verifyEmail: (email: string, code: string) => PromiseLike<boolean>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("starky_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("starky_token");
      if (storedToken) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            credentials: 'include'
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            console.warn("Token invalid, logging out");
            logout();
          }
        } catch (error) {
          console.error("Falha na verificação de autenticação", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("starky_token", data.token);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; requiresVerification?: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, message: data.message };
      }

      if (data.requiresVerification) {
        setIsLoading(false);
        return { success: true, requiresVerification: true };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("starky_token", data.token);

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return { success: false, message: "Erro de conexão" };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
        credentials: 'include'
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("starky_token", data.token);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("starky_token");
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      verifyEmail,
      logout,
      isLoading,
      token
    }}>
      {children}
    </AuthContext.Provider>
  );
}
