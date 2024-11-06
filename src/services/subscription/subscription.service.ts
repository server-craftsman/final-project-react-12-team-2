import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { GetSubscriptionsParams } from "../../models/api/request/subscription/sub.request.model";
import { ResponseSuccess } from "../../app/interface";
import { GetSubscriptionsResponse } from "../../models/api/responsive/subscription/sub.responsive.model";
import { UpdateSubscriptionsParams } from "../../models/api/request/subscription/update.request.model";
import { Subscriptions } from "../../models/api/responsive/subscription/update.response.model";

export const SubscriptionService = {
  //instructor
  getSubscriptions(params: GetSubscriptionsParams) {
    return BaseService.post<ResponseSuccess<GetSubscriptionsResponse>>({
      url: API.SUBSCRIPTION.GET_SUBSCRIPTIONS,
      payload: params
    });
  },
  //========public========
  createSubscribe(params: UpdateSubscriptionsParams) {
    return BaseService.post<ResponseSuccess<Subscriptions>>({
      url: API.SUBSCRIPTION.UPDATE_SUBSCRIPTION,
      payload: params
    });
  }
};
