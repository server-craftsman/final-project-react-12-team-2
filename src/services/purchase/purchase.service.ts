import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { SearchForAdminPurchasesResponseModel, SearchForStudentPurchaseResponseModel } from "../../models/api/responsive/purchase/purchase.reponse.model";
import { SearchForAdminPurchasesRequestModel, SearchForStudentPurchaseRequestModel } from "../../models/api/request/purchase/purchase.request.model";
import { SearchForInstructorPurchaseRequestModel } from "../../models/api/request/purchase/purchase.request.model";
import { SearchForInstructorPurchaseResponseModel } from "../../models/api/responsive/purchase/purchase.reponse.model";

export const PurchaseService = {
  searchForStudentPurchase(params: SearchForStudentPurchaseRequestModel) {
    return BaseService.post<ResponseSuccess<SearchForStudentPurchaseResponseModel>>({
      url: API.PURCHASE.GET_PURCHASE_FOR_STUDENT,
      payload: params
    });
  },
  searchForInstructorPurchase(params: SearchForInstructorPurchaseRequestModel) {
    return BaseService.post<ResponseSuccess<SearchForInstructorPurchaseResponseModel>>({
      url: API.PURCHASE.GET_PURCHASE_FOR_INSTRUCTOR,
      payload: params
    });
  },
  searchForAdminPurchases(params: SearchForAdminPurchasesRequestModel) {
    return BaseService.post<ResponseSuccess<SearchForAdminPurchasesResponseModel>>({
      url: API.PURCHASE.GET_PURCHASE_FOR_ADMIN,
      payload: params
    });
  }
};
