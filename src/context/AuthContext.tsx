import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Load session on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("starky_session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check against stored users
    const users = JSON.parse(localStorage.getItem("starky_users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userData);
      localStorage.setItem("starky_session", JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
     // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem("starky_users") || "[]");
    
    // Check if user exists
    if (users.some((u: any) => u.email === email)) {
      setIsLoading(false);
      return false; // Email already in use
    }
    
    const newUser = {
      id: "user_" + Date.now(),
      name,
      email,
      password // In a real app, never store passwords like this!
    };
    
    users.push(newUser);
    localStorage.setItem("starky_users", JSON.stringify(users));
    
    // Auto login after register
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userData);
    localStorage.setItem("starky_session", JSON.stringify(userData));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("starky_session");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
