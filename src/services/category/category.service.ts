import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { CreateCategoryParams, GetCategoryParams, UpdateCategoryParams } from "../../models/api/request/admin/category.request.model";
import { ResponseSuccess } from "../../app/interface";
import { CreateCategoryResponse, GetCategoryResponse, UpdateCategoryResponse, Category } from "../../models/api/responsive/admin/category.responsive.model";

export const CategoryService = {
  getCategory(params: GetCategoryParams) {
    return BaseService.post<ResponseSuccess<GetCategoryResponse>>({
      url: API.ADMIN.GET_CATEGORY,
      payload: params
    });
  },
  createCategory(params: CreateCategoryParams) {
    return BaseService.post<ResponseSuccess<CreateCategoryResponse>>({
      url: API.ADMIN.CREATE_CATEGORY,
      payload: params
    });
  },
  deleteCategory(id: string) {
    return BaseService.remove<ResponseSuccess<GetCategoryResponse>>({
      url: API.ADMIN.DELETE_CATEGORY.replace(":id", id)
    });
  },
  updateCategory(id: string, params: UpdateCategoryParams) {
    return BaseService.put<ResponseSuccess<UpdateCategoryResponse>>({
      url: API.ADMIN.UPDATE_CATEGORY.replace(":id", id),
      payload: params
    });
  },
  getCategoryDetails(id: string) {
    return BaseService.get<ResponseSuccess<Category>>({
      url: API.ADMIN.GET_CATEGORY_DETAILS.replace(":id", id)
    });
  }
};
