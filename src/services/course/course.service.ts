import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { CreateCourseParams, GetCourseParams, GetPublicCourseParams } from "../../models/api/request/course/course.request.model";
import { CreateCourseResponse, GetCourseResponse, GetPublicCourseResponse } from "../../models/api/responsive/course/course.response.model";

export const CourseService = {
  //instructor
  getCourse(params: GetCourseParams) {
    return BaseService.post<ResponseSuccess<GetCourseResponse>>({
      url: API.COURSE.GET_COURSE,
      payload: params
    });
  },
  createCourse(params: CreateCourseParams) {
    return BaseService.post<ResponseSuccess<CreateCourseResponse>>({
      url: API.COURSE.CREATE_COURSE,
      payload: params
    });
  },
  //=========================================

  //public
  getPublicCourse(params: GetPublicCourseParams) {
    return BaseService.post<ResponseSuccess<GetPublicCourseResponse>>({
      url: API.COURSE.GET_PUBLIC_COURSE,
      payload: params
    });
  }
  //=========================================
};
