import { ResponseSuccess } from "../../app/interface"
import { API } from "../../const/api.path"
import { GetBlogResponse } from "../../models/api/responsive/admin/blog.responsive.model"
import { BaseService } from "../config/base.service"

export const BlogService = {
    getBlogs (id: string){
        return BaseService.get<ResponseSuccess<GetBlogResponse>>({
            url: API.ADMIN.GET_BLOG_DETAILS.replace(":id", id),
        })

    }
}