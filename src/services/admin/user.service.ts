import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetUsersAdminParams, ChangeStatusParams, ChangeRoleParams } from "../../models/api/request/admin/user.request.model";
import { UpdateUserParams } from "../../models/api/request/users/user.request.model";
import { GetUsersAdminResponse } from "../../models/api/responsive/admin/user.responsive.model";
import { ResponseSuccess } from "../../app/interface/responseSuccess.interface";
import { User } from "../../models/api/responsive/users/users.model";

export const UserService = {
  getUsersAdmin(params: GetUsersAdminParams) {
    return BaseService.post<ResponseSuccess<GetUsersAdminResponse>>({
      url: API.ADMIN.GET_USERS,
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  getUserDetails(userId: string) {
    return BaseService.getById<ResponseSuccess<User>>({
      url: API.ADMIN.GET_USER_DETAILS.replace(":id", userId),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  updateUser(userId: string, params: UpdateUserParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.UPDATE_USER.replace(":id", userId),
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  changeStatus(userId: string, params: ChangeStatusParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.CHANGE_STATUS.replace(":id", userId),
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  },
  changeRole(userId: string, params: ChangeRoleParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.CHANGE_ROLE.replace(":id", userId),
      payload: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  }
};
