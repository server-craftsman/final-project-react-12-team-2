import { BaseService } from "../config/base.service";
import { User, UserRole } from "../../models/User";
import { API } from "../../const/api.path";

export const AuthService = {
  login(params: { email: string; password: string; toggleLoading: (isLoading: boolean) => void }) {
    return BaseService.post<{ user: User; role: UserRole }>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
      toggleLoading: params.toggleLoading,
    }).then(response => response.data);
  },
};
