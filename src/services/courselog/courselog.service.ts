import { ResponseSuccess } from '../../app/interface';
import { API } from '../../const/api.path';
import { GetCourseLogParams } from '../../models/api/request/admin/courselog.request';
import { BaseService } from '../config/base.service';
import { GetCourseLogResponse } from './../../models/api/responsive/admin/courselog.responsive';
export const CourseLogService = {
    getCourseLog(params:GetCourseLogParams ){
        return BaseService.post<ResponseSuccess<GetCourseLogResponse>>({
            url: API.ADMIN.GET_COURSE_LOG_DETAILS,
            payload: params
        })
    }
}