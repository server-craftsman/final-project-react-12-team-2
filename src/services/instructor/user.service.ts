import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
// import { GetUserDetailsResponse } from "../../models/api/responsive/admin/user.responsive.model";
import { ChangePasswordParams, UpdateUserParams } from "../../models/api/request/users/user.request.model";
import { GetCurrentUserResponse } from "../../models/api/responsive/authentication/auth.responsive.model";
import { ChangePasswordResponse } from "../../models/api/responsive/users/users.model";
import { ResponseSuccess } from "../../app/interface";
import { User } from "../../models/api/responsive/users/users.model";

export const UserService = {
  getUserDetails(userId: string) {
    return BaseService.getById<ResponseSuccess<User>>({
      url: API.INSTRUCTOR.GET_USER_DETAILS.replace(":id", userId),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  updateUser(userId: string, params: UpdateUserParams) {
    return BaseService.put<GetCurrentUserResponse>({
      url: API.INSTRUCTOR.UPDATE_USER.replace(":id", userId),
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  changePassword(userId: string, params: ChangePasswordParams) {
    return BaseService.put<ChangePasswordResponse>({
      url: API.INSTRUCTOR.CHANGE_PASSWORD.replace(":id", userId),
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  }
};
