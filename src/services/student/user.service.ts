import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { ChangePasswordResponse, User } from "../../models/api/responsive/users/users.model";
import { ChangePasswordParams, UpdateUserParams } from "../../models/api/request/users/user.request.model";
export const UserService = {
  getUserDetails(userId: string) {
    return BaseService.getById<ResponseSuccess<User>>({
      url: API.STUDENT.GET_USER_DETAILS.replace(":id", userId)
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`
      // }
    });
  },
  updateUser(userId: string, params: UpdateUserParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.STUDENT.UPDATE_USER.replace(":id", userId),
      payload: params
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`
      // }
    });
  },
  changePassword(userId: string, params: ChangePasswordParams) {
    return BaseService.put<ChangePasswordResponse>({
      url: API.STUDENT.CHANGE_PASSWORD.replace(":id", userId),
      payload: params
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`
      // }
    });
  }
};
