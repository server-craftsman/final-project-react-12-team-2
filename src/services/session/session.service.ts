import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { SessionRequestModel, CreateSessionRequestModel } from "../../models/api/request/session/session.request.model";
import { SessionResponse, CreateSessionResponse, SessionDetailResponse } from "../../models/api/responsive/session/session.response.model";

export const SessionService = {
  getSession: (params: SessionRequestModel) => {
    return BaseService.post<ResponseSuccess<SessionResponse>>({
      url: API.SESSION.GET_SESSION,
      payload: params
    });
  },
  getSessionDetail: (sessionId: string) => {
    return BaseService.get<ResponseSuccess<SessionDetailResponse>>({
      url: API.SESSION.GET_SESSION_DETAIL.replace(":id", sessionId)
    });
  },
  createSession: (params: CreateSessionRequestModel) => {
    return BaseService.post<ResponseSuccess<CreateSessionResponse>>({
      url: API.SESSION.CREATE_SESSION,
      payload: params
    });
  },
  updateSession: (params: CreateSessionRequestModel, sessionId: string) => {
    return BaseService.put<ResponseSuccess<CreateSessionResponse>>({
      url: API.SESSION.UPDATE_SESSION.replace(":id", sessionId),
      payload: params
    });
  },
  deleteSession: (sessionId: string) => {
    return BaseService.remove<ResponseSuccess<string>>({
      url: API.SESSION.DELETE_SESSION.replace(":id", sessionId)
    });
  }
};
