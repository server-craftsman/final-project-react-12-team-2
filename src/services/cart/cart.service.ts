import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { GetCartItemsParams, UpdateCartStatusParams } from "../../models/api/request/cart/cart.request.model";
import { CreateCartResponse, GetCartItemsResponse } from "../../models/api/responsive/cart/cart.responsive.model";

export const CartService = {
  createCart(courseId: string) {
    return BaseService.post<ResponseSuccess<CreateCartResponse>>({
      url: API.CART.CREATE_CART,
      payload: { course_id: courseId }
    });
  },
  getCartItems(params: GetCartItemsParams) {
    return BaseService.post<ResponseSuccess<GetCartItemsResponse>>({
      url: API.CART.GET_CART_ITEMS,
      payload: params
    });
  },
  updateCartStatus(params: UpdateCartStatusParams) {
    return BaseService.post<ResponseSuccess<any>>({
      url: API.CART.UPDATE_CART_STATUS,
      payload: params
    });
  },
  deleteCart(cartId: string) {
    return BaseService.remove<ResponseSuccess<any>>({
      url: API.CART.DELETE_CART.replace(":id", cartId)
    });
  }
};
