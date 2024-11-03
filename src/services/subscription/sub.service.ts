import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetSubscribersParams, GetSubscriptionsParams } from "../../models/api/request/subscription/sub.request.model";
import { ResponseSuccess } from "../../app/interface";
import { GetSubscribersResponse, GetSubscriptionsResponse } from "../../models/api/responsive/subscription/sub.responsive.model";

export const SubscriptionService = {
  getSubscriptions(params: GetSubscriptionsParams){
    return BaseService.post<ResponseSuccess<GetSubscriptionsResponse>>({
      url: API.SUBSCRIPTION.GET_SUBSCRIPTIONS,
      payload: params
    });
  }
};
export const SubscriberService = {
  getSubscribers(params: GetSubscribersParams) {
    return BaseService.post<ResponseSuccess<GetSubscribersResponse>>({
      url: API.SUBSCRIPTION.GET_SUBSCRIBERS,
      payload: params
    });
  }
};
