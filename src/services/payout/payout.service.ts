import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { CreatePayoutResponseModel } from "../../models/api/responsive/payout/payout.response.model";
import { CreatePayoutRequestModel } from "../../models/api/request/payout/payout.request.model";

export const PayoutService = {
  createPayout(params: CreatePayoutRequestModel) {
    return BaseService.post<ResponseSuccess<CreatePayoutResponseModel>>({
      url: API.PAYOUT.CREATE_PAYOUT,
      payload: params
    });
  }
};
