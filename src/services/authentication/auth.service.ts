import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { User } from "../../models/User";

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<{ token: string }>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
    });
  },
};