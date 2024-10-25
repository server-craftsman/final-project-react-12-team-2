import { UserRole } from "../../../../models/prototype/User";

export interface GetUsersAdminParams {
  searchCondition: {
    keyword?: string;
    role?: UserRole | undefined;
    status?: boolean | undefined;
    is_verified?: boolean | undefined;
    is_delete?: boolean | undefined;
  };
  pageInfo: {
    pageNum?: number;
    pageSize?: number;
  };
}
