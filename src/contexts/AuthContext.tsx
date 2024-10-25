import { createContext, useContext, ReactNode, useState } from 'react';
import { UserRole } from '../models/prototype/User';
import { GetCurrentUserResponse, RegisterGooglePublicResponse } from '../models/api/responsive/authentication/auth.responsive.model';
import { AuthService } from '../services/authentication/auth.service';
import { RegisterStudentPublicParams, RegisterInstructorPublicParams } from '../models/api/request/authentication/auth.request.model';
interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  userInfo: GetCurrentUserResponse['data'] | null;
  getCurrentUser: () => Promise<void>;
  setUserInfo: (userInfo: GetCurrentUserResponse['data'] | null) => void;
  logout: () => void;
  handleLogin: (token: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  loginGoogle: (googleId: string) => Promise<void>;
  registerGooglePublic: (params: RegisterStudentPublicParams | RegisterInstructorPublicParams) => Promise<RegisterGooglePublicResponse>;
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

  const [userInfo, setUserInfo] = useState<GetCurrentUserResponse['data'] | null>(null); // Initialize from localStorage
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentUser = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        logout();
        return;
      }
      const response = await AuthService.getUserRole(storedToken);
      setUserInfo(response.data?.data as unknown as GetCurrentUserResponse['data']);
      // Remove the return statement
    } catch (error) {
      console.error('Failed to get current user:', error);
      logout();
    }
  };

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

  const registerGooglePublic = async (params: RegisterStudentPublicParams | RegisterInstructorPublicParams): Promise<RegisterGooglePublicResponse> => {
    const response = await AuthService.registerGooglePublic(params);
    console.log(response);
    return response.data; // Ensure this returns the correct structure
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
      registerGooglePublic,
      getCurrentUser,
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
