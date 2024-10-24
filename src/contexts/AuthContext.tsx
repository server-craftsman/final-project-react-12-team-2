import { createContext, useContext, ReactNode, useState } from 'react';
import { UserRole } from '../models/User';
import { GetCurrentUserResponse } from '../models/api/getCurrentUser';
import { AuthService } from '../services/authentication/auth.service';

interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  userInfo: GetCurrentUserResponse['data'] | null;
  setUserInfo: (userInfo: GetCurrentUserResponse['data'] | null) => void;
  logout: () => void;
  handleLogin: (token: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  loginGoogle: (googleId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    // Initialize from localStorage
    const storedRole = localStorage.getItem("role");
    return storedRole as UserRole | null;
  });
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem("token");
    return storedToken as string | null;
  });
  const [userInfo, setUserInfo] = useState<GetCurrentUserResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginGoogle = async (googleId: string) => {
    try {
      const response = await AuthService.loginGoogle({ google_id: googleId });
      if (response.data?.data?.token) {
        const token = response.data.data.token;
        setToken(token);
        localStorage.setItem("token", token);
        await handleLogin(token);
      }
    } catch (error) {
      console.error("Failed to login with Google:", error);
    }
  };

  const logout = () => {
    setRole(null);
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleLogin = async (token: string) => {
    try {
      // Save token
      localStorage.setItem("token", token);
      setToken(token);

      // Fetch user info
      const response = await AuthService.getUserRole(token);
      if (response.data?.data) {
        const userData = response.data.data;
        setUserInfo(userData);
        setRole(userData.role as UserRole);
        localStorage.setItem("role", userData.role);
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
      logout();
    }
  };

  
  return (
    <AuthContext.Provider value={{ 
      role, 
      setRole, 
      token, 
      setToken, 
      userInfo, 
      setUserInfo, 
      logout,
      handleLogin,
      isLoading,
      setIsLoading,
      loginGoogle,
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
