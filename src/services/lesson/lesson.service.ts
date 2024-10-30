import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { CreateLessonRequest } from "../../models/api/request/lesson/lesson.request.model";
import { ResponseSuccess } from "../../app/interface";
import { CreateLessonResponse } from "../../models/api/responsive/lesson/lesson.response.model";

export const LessonService = {
  createLesson(params: CreateLessonRequest) {
    return BaseService.post<ResponseSuccess<CreateLessonResponse>>({
      url: API.LESSON.CREATE_LESSON,
      payload: params
    });
  }
};
