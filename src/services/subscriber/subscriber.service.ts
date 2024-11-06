import { ResponseSuccess } from "../../app/interface";
import { API } from "../../const/api.path";
import { GetSubscribersParams } from "../../models/api/request/subscriber/subscriber.request.model";
import { GetSubscribersResponse } from "../../models/api/responsive/subscriber/subscriber.response.model";
import { BaseService } from "../config/base.service";

export const SubscriberService = {
  getSubscribers(params: GetSubscribersParams) {
    return BaseService.post<ResponseSuccess<GetSubscribersResponse>>({
      url: API.SUBSCRIPTION.GET_SUBSCRIBERS,
      payload: params
    });
  }
};
