import { PurchaseStatusEnum } from "../models/prototype/Purchases";
export const ColorPurchaseStatusEnum = {
  [PurchaseStatusEnum.new]: "blue",
  [PurchaseStatusEnum.request_paid]: "orange",
  [PurchaseStatusEnum.completed]: "green",
};
