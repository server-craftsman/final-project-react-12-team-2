import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetCategoryParams } from "../../models/api/request/admin/category.request.model";
import { ResponseSuccess } from "../../app/interface";
import { GetCategoryResponse } from "../../models/api/responsive/admin/category.responsive.model";

export const CategoryService = {
  getCategory(params: GetCategoryParams) {
    return BaseService.post<ResponseSuccess<GetCategoryResponse>>({
      url: API.ADMIN.GET_CATEGORY,
      payload: params
    });
  }
};

