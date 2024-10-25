import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetUsersAdminParams } from "../../models/api/request/admin/user.request.model";
import { UpdateUserParams } from "../../models/api/request/users/user.request.model";
import {
  GetUsersAdminResponse,
  GetUserDetailsResponse,
} from "../../models/api/responsive/admin/user.responsive.model";
import { GetCurrentUserResponse } from "../../models/api/responsive/authentication/auth.responsive.model";

export const UserService = {
  getUsersAdmin(params: GetUsersAdminParams) {
    return BaseService.post<GetUsersAdminResponse>({
      url: API.ADMIN.GET_USERS,
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
  getUserDetails(userId: string) {
    return BaseService.get<GetUserDetailsResponse>({
      url: API.ADMIN.GET_USER_DETAILS.replace(":id", userId),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
  updateUser(userId: string, params: UpdateUserParams) {
    return BaseService.put<GetCurrentUserResponse>({
      url: API.ADMIN.UPDATE_USER.replace(":id", userId),
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};
