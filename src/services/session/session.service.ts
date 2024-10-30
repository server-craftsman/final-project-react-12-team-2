import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { SessionRequestModel, CreateSessionRequestModel } from "../../models/api/request/session/session.request.model";
import { SessionResponse, CreateSessionResponse } from "../../models/api/responsive/session/session.response.model";

export const SessionService = {
  getSession: (params: SessionRequestModel) => {
    return BaseService.post<ResponseSuccess<SessionResponse>>({
      url: API.SESSION.GET_SESSION,
      payload: params
    });
  },
  createSession: (params: CreateSessionRequestModel) => {
    return BaseService.post<ResponseSuccess<CreateSessionResponse>>({
      url: API.SESSION.CREATE_SESSION,
      payload: params
    });
  }
};
