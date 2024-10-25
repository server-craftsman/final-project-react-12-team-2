import { User } from "../../responsive/users/users.model";
export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface GetUsersAdminResponse {
  success: boolean;
  data: {
    pageData: User[]; // Array of User objects
    pageInfo: PageInfo;
  };
}
