import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { CreatePayoutRequestModel, GetPayoutRequestModel, UpdatePayoutResponseModel } from "../../models/api/request/payout/payout.request.model";
import { CreatePayoutResponseModel, GetPayoutResponseModel } from "../../models/api/responsive/payout/payout.response.model";

export const PayoutService = {
  createPayout(params: CreatePayoutRequestModel) {
    return BaseService.post<ResponseSuccess<CreatePayoutResponseModel>>({
      url: API.PAYOUT.CREATE_PAYOUT,
      payload: params
    });
  },
  //list payout (admin or instructor)
  getPayout(params: GetPayoutRequestModel) {
    return BaseService.get<ResponseSuccess<GetPayoutResponseModel>>({
      url: API.PAYOUT.GET_PAYOUT,
      payload: params
    });
  },
  //update payout (admin or instructor)
  updatePayout(id: string, params: UpdatePayoutResponseModel) {
    return BaseService.put<ResponseSuccess<string>>({
      url: API.PAYOUT.UPDATE_PAYOUT.replace(":id", id),
      payload: params
    });
  }
};
