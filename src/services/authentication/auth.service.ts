import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetCurrentUserResponse } from "../../models/api/getCurrentUser";
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
  logout() {
    return BaseService.get<{ success: boolean; data: string }>({
      url: API.AUTH.LOGOUT,
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
