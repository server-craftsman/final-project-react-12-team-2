import { PurchaseStatus } from "../../../../app/enums";

export interface SearchForStudentPurchaseRequestModel {
  searchCondition: {
    purchase_no: string;
    cart_no: string;
    course_id: string;
    status: PurchaseStatus;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}