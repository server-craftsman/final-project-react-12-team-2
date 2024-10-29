import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { GetCourseParams } from "../../models/api/request/course/course.request.model";
import { GetCourseResponse } from "../../models/api/responsive/course/course.response.model";

export const CourseService = {
  getCourse: async (params: GetCourseParams) => {
    return BaseService.post<ResponseSuccess<GetCourseResponse>>({
      url: API.COURSE.GET_COURSE,
      payload: params
    });
  }
};
