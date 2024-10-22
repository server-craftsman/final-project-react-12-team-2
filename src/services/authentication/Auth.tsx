import { BaseService } from "../config/base.service";
import { User, UserRole } from "../../models/User";
import { API } from "../../const/api.path";

export const AuthService = {
  login(params: { email: string; password: string }) {
    return BaseService.post<{ user: User; role: UserRole }>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
    }).then(response => response.data); // Ensure the response is correctly handled
  },
};
