import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetCurrentUserResponse } from "../../models/api/getCurrentUser";
import { SetCreateUserResponse } from "../../models/api/setCreateUser";
import { GetCreateUserResponse } from "../../models/api/getCreateUser";

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<{ success: boolean; data: { token: string } }>({
      url: API.AUTH.LOGIN,
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
  createUser(params: SetCreateUserResponse["data"], token: string) {
    return BaseService.post<GetCreateUserResponse>({
      url: API.USER.CREATE,
      payload: params,
      isLoading: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
