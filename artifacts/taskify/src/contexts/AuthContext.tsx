import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { User, LoginInput, RegisterInput, AuthResponse } from "@workspace/api-zod";
import { login as apiLogin, register as apiRegister, logout as apiLogout, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<AuthResponse>;
  register: (data: RegisterInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("taskify_token") : null
  );
  const [, setLocation] = useLocation();

  const { data: user, isLoading: isUserLoading, error } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      enabled: !!token,
      retry: false,
    }
  });

  useEffect(() => {
    if (error) {
      localStorage.removeItem("taskify_token");
      setToken(null);
    }
  }, [error]);

  const login = async (data: LoginInput) => {
    const response = await apiLogin(data);
    if (response.token) {
      localStorage.setItem("taskify_token", response.token);
      setToken(response.token);
    }
    return response;
  };

  const register = async (data: RegisterInput) => {
    const response = await apiRegister(data);
    if (response.token) {
      localStorage.setItem("taskify_token", response.token);
      setToken(response.token);
    }
    return response;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("taskify_token");
    setToken(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      token,
      isLoading: isUserLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
