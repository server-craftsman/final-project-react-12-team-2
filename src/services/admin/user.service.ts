import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetUsersAdminParams, ChangeStatusParams, ChangeRoleParams, ChangePasswordParams, CreateUserParams } from "../../models/api/request/admin/user.request.model";
import { UpdateUserParams } from "../../models/api/request/users/user.request.model";
import { GetUsersAdminResponse } from "../../models/api/responsive/admin/user.responsive.model";
import { ResponseSuccess } from "../../app/interface";
import { User } from "../../models/api/responsive/users/users.model";
import { ReviewProfileInstructorParams } from "../../models/api/request/admin/user.request.model";

export const UserService = {
  getUsersAdmin(params: GetUsersAdminParams) {
    return BaseService.post<ResponseSuccess<GetUsersAdminResponse>>({
      url: API.ADMIN.GET_USERS,
      payload: params
    });
  },
  getUserDetails(userId: string) {
    return BaseService.getById<ResponseSuccess<User>>({
      url: API.ADMIN.GET_USER_DETAILS.replace(":id", userId)
    });
  },
  updateUser(userId: string, params: UpdateUserParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.UPDATE_USER.replace(":id", userId),
      payload: params
    });
  },
  changeStatus(userId: string, params: ChangeStatusParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.CHANGE_STATUS.replace(":id", userId),
      payload: params
    });
  },
  changeRole(userId: string, params: ChangeRoleParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.CHANGE_ROLE.replace(":id", userId),
      payload: params
    });
  },
  changePassword(params: ChangePasswordParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.CHANGE_PASSWORD,
      payload: params
    });
  },
  deleteUser(userId: string) {
    return BaseService.remove<ResponseSuccess<User>>({
      url: API.ADMIN.DELETE_USER.replace(":id", userId)
    });
  },
  createUser(params: CreateUserParams) {
    return BaseService.post<ResponseSuccess<User>>({
      url: API.ADMIN.CREATE_USER,
      payload: params
    });
  },
  reviewProfileInstructor(params: ReviewProfileInstructorParams) {
    return BaseService.put<ResponseSuccess<User>>({
      url: API.ADMIN.REVIEW_PROFILE_INSTRUCTOR,
      payload: params
    });
  }
};
