import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { CreateReviewRequestModel, SearchForReviewRequestModel, UpdateReviewRequestModel } from "../../models/api/request/review/review.request.model";
import { CreateReviewResponseModel, SearchForReviewResponseModel, UpdateReviewResponseModel, GetReviewByIdResponseModel } from "../../models/api/responsive/review/review.response.model";

export const ReviewService = {
  searchForReview(params: SearchForReviewRequestModel) {
    return BaseService.post<ResponseSuccess<SearchForReviewResponseModel>>({
      url: API.REVIEW.GET_REVIEW,
      payload: params
    });
  },
  getReviewById(id: string) {
    return BaseService.get<ResponseSuccess<GetReviewByIdResponseModel>>({
      url: API.REVIEW.GET_REVIEW_BY_ID.replace(":id", id)
    });
  },
  createReview(params: CreateReviewRequestModel) {
    return BaseService.post<ResponseSuccess<CreateReviewResponseModel>>({
      url: API.REVIEW.CREATE_REVIEW,
      payload: params
    });
  },
  updateReview(id: string, params: UpdateReviewRequestModel) {
    return BaseService.put<ResponseSuccess<UpdateReviewResponseModel>>({
      url: API.REVIEW.UPDATE_REVIEW.replace(":id", id),
      payload: params
    });
  },
  deleteReview(id: string) {
    return BaseService.remove<ResponseSuccess<string>>({
      url: API.REVIEW.DELETE_REVIEW.replace(":id", id)
    });
  }
};
