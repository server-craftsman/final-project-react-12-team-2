import { ResponseSuccess } from "../../app/interface";
import { API } from "../../const/api.path";
import { CreateBlogBody, GetBlogParams } from "../../models/api/request/admin/blog.request.model";
import { GetBlogResponse, UpdateBlogParams } from "../../models/api/responsive/admin/blog.responsive.model";
import { BaseService } from "../config/base.service";

export const BlogService = {
  createBlog(body: CreateBlogBody) {
    return BaseService.post<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.CREATE_BLOG,
      payload: body
    });
  },
  getBlog(params: GetBlogParams) {
    return BaseService.post<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.GET_BLOG,
      payload: params
    });
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
  },
  deleteBlog(id: string) {
    return BaseService.remove<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.DELETE_BLOG.replace(":id", id)
    });
  }
};
