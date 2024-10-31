import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetSubscriptionsParams } from "../../models/api/request/subscription/sub.request.model";
import { ResponseSuccess } from "../../app/interface";
import { GetSubscriptionsResponse } from "../../models/api/responsive/subscription/sub.responsive.model";

export const SubscriptionService = {
  getSubscriptions(params: GetSubscriptionsParams) {
    return BaseService.post<ResponseSuccess<GetSubscriptionsResponse>>({
      url: API.SUBSCRIPTION.GET_SUBSCRIPTIONS,
      payload: params
    });
  }
};
