import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetCoursesLogsParams } from "../../models/api/request/admin/courseslog.request.model";
import { GetCoursesLogsResponse } from "../../models/api/responsive/admin/courselog.reponsive.model";
import { ResponseSuccess } from "../../app/interface";

export const courseLogService = {
  getCoursesLogs(params: GetCoursesLogsParams) {
    return BaseService.post<ResponseSuccess<GetCoursesLogsResponse>>({
      url: API.COURSE.GET_COURSES_LOGS,
      payload: params
    });
  }
}
