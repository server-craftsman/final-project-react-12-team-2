import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<{ success: boolean; data: { token: string } }>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
    });
  },
  getUserRole(token: string) {
    return BaseService.get<{ success: boolean; data: { role: string } }>({
      url: API.AUTH.LOGIN,
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
