// blog.service.ts
import { ResponseSuccess } from "../../app/interface";
import { API } from "../../const/api.path";
import { CreateBlogBody, GetBlogParams } from "../../models/api/request/admin/blog.request.model";
import { GetBlogResponse, getPublicBlogsDetails, UpdateBlogParams } from "../../models/api/responsive/admin/blog.responsive.model";
import { BaseService } from "../config/base.service";

export const BlogService = {
  // Admin
  createBlog(body: CreateBlogBody) {
    return BaseService.post<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.CREATE_BLOG,
      payload: body,
    });
  },
  getBlogsDetails(id: string) {
    return BaseService.get<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.GET_BLOG_DETAILS.replace(":id", id),
    });
  },
  // Get Blog
  getBlog(params: GetBlogParams) {
    return BaseService.post<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.GET_BLOG,
      payload: params,
    });
  },
  updateBlog(id: string, params: UpdateBlogParams) {
    return BaseService.put<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.UPDATE_BLOG.replace(":id", id),
      payload: params,
    });
  },
  deleteBlog(id: string) {
    return BaseService.remove<ResponseSuccess<GetBlogResponse>>({
      url: API.ADMIN.DELETE_BLOG.replace(":id", id),
    });
  },

  // Public
  getPublicBlogs(params: GetBlogParams) {
    return BaseService.post<ResponseSuccess<GetBlogResponse>>({
      url: API.BLOG.GET_BLOGS,
      payload: params,
    });
  },

  getPublicBlogsDetails(id: string) {
    return BaseService.get<ResponseSuccess<getPublicBlogsDetails>>({
      url: API.BLOG.GET_BLOGS_DETAILS.replace(":id", id),
    });
  },
};
