import { BaseService } from "../config/base.service";
import { API } from "../../const/api.path";
import { ResponseSuccess } from "../../app/interface";
import { CreateCartResponse } from "../../models/api/responsive/cart/cart.responsive.model";

export const CartService = {
  createCart(courseId: string) {
    return BaseService.post<ResponseSuccess<CreateCartResponse>>({
      url: API.CART,
      payload: { course_id: courseId }
    });
  }
};
