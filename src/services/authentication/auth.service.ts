import { BaseService } from "../config/base.service";
import { User, UserRole } from "../../models/User";
import { API } from "../../const/api.path";

export const AuthService = {
  login(params: {
    email: string;
    password: string;
    toggleLoading: (isLoading: boolean) => void;
  }) {
    return BaseService.post<{ user: User; role: UserRole; token: string }>({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
      toggleLoading: params.toggleLoading,
    }).then((response) => {
      const { token } = response.data;
      localStorage.setItem("authToken", token); // Store token in local storage
      return response.data;
    });
  },
};
