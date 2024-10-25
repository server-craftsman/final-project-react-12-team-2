import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import {
  GetCurrentUserResponse,
  RegisterGooglePublicResponse,
} from "../../models/api/responsive/authentication/auth.responsive.model";
import {
  RegisterStudentPublicParams,
  RegisterInstructorPublicParams,
} from "../../models/api/request/authentication/auth.request.model";

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<{ success: boolean; data: { token: string } }>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
    });
  },
  loginGoogle(params: { google_id: string }) {
    return BaseService.post<{ success: boolean; data: { token: string } }>({
      url: API.AUTH.LOGIN_GOOGLE,
      payload: params,
      isLoading: true,
    });
  },
  registerGooglePublic(
    params: RegisterStudentPublicParams | RegisterInstructorPublicParams,
  ) {
    return BaseService.post<RegisterGooglePublicResponse>({
      url: API.AUTH.REGISTER_GOOGLE_PUBLIC,
      payload: params,
      isLoading: true,
    });
  },
  logout() {
    return BaseService.get<{ success: boolean; data: string }>({
      url: API.AUTH.LOGOUT,
      isLoading: true,
    });
  },
  verifyToken(token: string) {
    return BaseService.get<{ success: boolean; data: string }>({
      url: API.AUTH.VERIFY_TOKEN,
      headers: { Authorization: `Bearer ${token}` },
      isLoading: true,
    });
  },
  getUserRole(token: string) {
    return BaseService.get<GetCurrentUserResponse>({
      url: API.AUTH.LOGIN,
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
};
