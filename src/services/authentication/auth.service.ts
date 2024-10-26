import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { RegisterGooglePublicResponse } from "../../models/api/responsive/authentication/auth.responsive.model";
import { RegisterStudentPublicParams, RegisterInstructorPublicParams, RegisterParams } from "../../models/api/request/authentication/auth.request.model";
import { ResponseSuccess } from "../../app/interface";
import { User } from "../../models/api/responsive/users/users.model"; //data user

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<ResponseSuccess<{ token: string }>>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true
    });
  },
  loginGoogle(params: { google_id: string }) {
    return BaseService.post<ResponseSuccess<{ token: string }>>({
      url: API.AUTH.LOGIN_GOOGLE,
      payload: params,
      isLoading: true
    });
  },
  registerGooglePublic(params: RegisterStudentPublicParams | RegisterInstructorPublicParams) {
    return BaseService.post<ResponseSuccess<RegisterGooglePublicResponse>>({
      url: API.AUTH.REGISTER_GOOGLE_PUBLIC,
      payload: params,
      isLoading: true
    });
  },
  logout() {
    return BaseService.get<ResponseSuccess<string>>({
      url: API.AUTH.LOGOUT,
      isLoading: true
    });
  },
  verifyToken(token: string) {
    return BaseService.get<ResponseSuccess<User>>({
      url: API.AUTH.VERIFY_TOKEN,
      payload: { token },
      isLoading: true
    });
  },
  getUserRole(token: string) {
    return BaseService.get<ResponseSuccess<User>>({
      url: API.AUTH.LOGIN,
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  register(params: RegisterParams) {
    return BaseService.post<ResponseSuccess<User>>({
      url: API.AUTH.REGISTER,
      payload: params
    });
  }
};
