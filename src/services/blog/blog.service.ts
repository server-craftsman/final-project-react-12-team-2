import { ResponseSuccess } from "../../app/interface";
import { API } from "../../const/api.path";
import { GetBlogParams } from "../../models/api/request/admin/blog.request.model";
import { GetBlogResponse, UpdateBlogParams } from "../../models/api/responsive/admin/blog.responsive.model";
import { BaseService } from "../config/base.service";

export const BlogService = {
  getBlog(params: GetBlogParams){
    return BaseService.post<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.GET_BLOG,
      payload: params
    })
  },

  getBlogs(id: string) {
    return BaseService.get<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.GET_BLOG_DETAILS.replace(":id", id)
    });
  },

  updateBlog(id: string, params: UpdateBlogParams) {
    return BaseService.put<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.UPDATE_BLOG.replace(":id", id),
      payload: params
    });
  }
};
