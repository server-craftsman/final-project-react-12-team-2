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
      handleLogin
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
