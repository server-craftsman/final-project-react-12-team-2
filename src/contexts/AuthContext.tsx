import { createContext, useContext, ReactNode, useState } from "react";
import { UserRole } from "../models/prototype/User";
import { GetCurrentUserResponse, RegisterGooglePublicResponse } from "../models/api/responsive/authentication/auth.responsive.model";
import { AuthService } from "../services/authentication/auth.service";
import { RegisterStudentPublicParams, RegisterInstructorPublicParams } from "../models/api/request/authentication/auth.request.model";
import { HTTP_STATUS } from "../app/enums";
import { HttpException } from "../app/exceptions";

interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  userInfo: GetCurrentUserResponse["data"] | null;
  getCurrentUser: () => Promise<void>;
  setUserInfo: (userInfo: GetCurrentUserResponse["data"] | null) => void;
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
    const storedRole = localStorage.getItem("role");
    return storedRole as UserRole | null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken as string | null;
  });

  const [userInfo, setUserInfo] = useState<GetCurrentUserResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentUser = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new HttpException("No token found", HTTP_STATUS.UNAUTHORIZED);
      }
      const response = await AuthService.getUserRole(storedToken);
      if (!response.data?.data) {
        throw new HttpException("Invalid response data", HTTP_STATUS.BAD_REQUEST);
      }
      setUserInfo(response.data.data as GetCurrentUserResponse["data"]);
    } catch (error) {
      console.error("Failed to get current user:", error);
      logout();
      throw error instanceof HttpException ? error : new HttpException("Failed to get current user", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  const loginGoogle = async (googleId: string) => {
    try {
      const response = await AuthService.loginGoogle({ google_id: googleId });
      if (!response.data?.data?.token) {
        throw new HttpException("Invalid login response", HTTP_STATUS.BAD_REQUEST);
      }
      const token = response.data.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      await handleLogin(token);
    } catch (error) {
      console.error("Failed to login with Google:", error);
      throw error instanceof HttpException ? error : new HttpException("Failed to login with Google", HTTP_STATUS.INTERNAL_SERVER_ERROR);
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
      if (!token) {
        throw new HttpException("No token provided", HTTP_STATUS.UNAUTHORIZED);
      }
      localStorage.setItem("token", token);
      setToken(token);

      const response = await AuthService.getUserRole(token);
      if (!response.data?.data) {
        throw new HttpException("Invalid user data", HTTP_STATUS.BAD_REQUEST);
      }
      const userData = response.data.data;
      setUserInfo(userData);
      setRole(userData.role as UserRole);
      localStorage.setItem("role", userData.role);
    } catch (error) {
      console.error("Failed to get user info:", error);
      logout();
      throw error instanceof HttpException ? error : new HttpException("Failed to get user info", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  const registerGooglePublic = async (params: RegisterStudentPublicParams | RegisterInstructorPublicParams): Promise<RegisterGooglePublicResponse> => {
    try {
      const response = await AuthService.registerGooglePublic(params);
      if (!response.data) {
        throw new HttpException("Invalid registration response", HTTP_STATUS.BAD_REQUEST);
      }
      return response.data;
    } catch (error) {
      console.error("Failed to register with Google:", error);
      throw error instanceof HttpException ? error : new HttpException("Failed to register with Google", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
        getCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
