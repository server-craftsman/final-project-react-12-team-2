import { createContext, useContext, ReactNode, useState } from "react";
import { UserRole } from "../models/prototype/User";
// import { RegisterGooglePublicResponse } from "../models/api/responsive/authentication/auth.responsive.model";
import { AuthService } from "../services/authentication/auth.service";
import { UserService } from "../services/admin/user.service";
import { RegisterStudentPublicParams, RegisterInstructorPublicParams, RegisterParams } from "../models/api/request/authentication/auth.request.model";
import { ChangePasswordParams } from "../models/api/request/admin/user.request.model";
import { HTTP_STATUS } from "../app/enums";
import { HttpException } from "../app/exceptions";

import { User } from "../models/api/responsive/users/users.model";
import { ResponseSuccess } from "../app/interface";

interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  userInfo: ResponseSuccess<User>["data"] | null;
  getCurrentUser: () => Promise<void>;
  setUserInfo: (userInfo: ResponseSuccess<User>["data"] | null) => void;
  logout: () => void;
  handleLogin: (token: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  loginGoogle: (googleId: string) => Promise<void>;
  registerGooglePublic: (params: RegisterStudentPublicParams | RegisterInstructorPublicParams) => Promise<ResponseSuccess<User>>;
  changePassword: (params: ChangePasswordParams) => Promise<ResponseSuccess<User>>;
  register: (params: RegisterParams) => Promise<ResponseSuccess<User>>;
  verifyToken: (params: { token: string }) => Promise<ResponseSuccess<string>>;
  resendToken: (params: { email: string }) => Promise<ResponseSuccess<string>>;
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

  const [userInfo, setUserInfo] = useState<ResponseSuccess<User>["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //get current user
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
      setUserInfo(response.data.data);
    } catch (error) {
      console.error("Failed to get current user:", error);
      logout();
      throw error instanceof HttpException ? error : new HttpException("Failed to get current user", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  //login google
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

  //logout
  const logout = () => {
    setRole(null);
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  //handle login
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

  //register google public ---can be used for student and instructor
  const registerGooglePublic = async (params: RegisterStudentPublicParams | RegisterInstructorPublicParams): Promise<ResponseSuccess<User>> => {
    try {
      const response = await AuthService.registerGooglePublic(params);
      if (!response.data) {
        throw new HttpException("Invalid registration response", HTTP_STATUS.BAD_REQUEST);
      }
      return response.data as unknown as ResponseSuccess<User>;
    } catch (error) {
      console.error("Failed to register with Google:", error);
      throw error instanceof HttpException ? error : new HttpException("Failed to register with Google", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  //change password
  const changePassword = async (params: ChangePasswordParams): Promise<ResponseSuccess<User>> => {
    try {
      // Lấy token và userInfo hiện tại
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new HttpException("No token found", HTTP_STATUS.UNAUTHORIZED);
      }

      // Lấy thông tin user hiện tại để có user_id
      await getCurrentUser();
      if (!userInfo?._id) {
        throw new HttpException("User ID not found", HTTP_STATUS.BAD_REQUEST);
      }

      // Tạo params với user_id
      const updatedParams: ChangePasswordParams = {
        old_password: params.old_password,
        new_password: params.new_password,
        user_id: userInfo._id
      };

      const response = await UserService.changePassword(updatedParams);
      if (!response.data) {
        throw new HttpException("Invalid change password response", HTTP_STATUS.BAD_REQUEST);
      }
      return response.data;
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error instanceof HttpException ? error : new HttpException("Failed to change password", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  //register
  const register = async (params: RegisterParams): Promise<ResponseSuccess<User>> => {
    try {
      const response = await AuthService.register(params);
      if (!response.data) {
        throw new HttpException("Invalid registration response", HTTP_STATUS.BAD_REQUEST);
      }
      return response.data;
    } catch (error) {
      // Log a simplified error message instead of the entire error object
      console.error("Failed to register:", error instanceof HttpException ? error.message : "Unknown error");

      // Throw a new HttpException with a simplified message
      throw error instanceof HttpException ? error : new HttpException("Failed to register", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  //verify token
  const verifyToken = async (params: { token: string }): Promise<ResponseSuccess<string>> => {
    try {
      const response = await AuthService.verifyToken(params);
      if (!response.data) {
        throw new HttpException("Invalid verify token response", HTTP_STATUS.BAD_REQUEST);
      }
      // Return the entire response since the API returns ResponseSuccess<string>
      return response.data;
    } catch (error) {
      console.error("Failed to verify token:", error);
      throw error instanceof HttpException ? error : new HttpException("Failed to verify token", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  //resend token
  const resendToken = async (params: { email: string }): Promise<ResponseSuccess<string>> => {
    try {
      const response = await AuthService.resendToken(params);
      if (!response.data) {
        throw new HttpException("Invalid resend token response", HTTP_STATUS.BAD_REQUEST);
      }
      // Return the entire response since the API returns ResponseSuccess<string>
      return response.data;
    } catch (error) {
      console.error("Failed to resend token:", error);
      throw error instanceof HttpException ? error : new HttpException("Failed to resend token", HTTP_STATUS.INTERNAL_SERVER_ERROR);
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
        changePassword,
        register,
        verifyToken,
        resendToken,
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
