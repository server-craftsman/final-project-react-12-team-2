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

export interface ChangeStatusParams {
  user_id: string;
  status: boolean;
}

export interface ChangeRoleParams {
  user_id: string;
  role: UserRole;
}

export interface ChangePasswordParams {
  user_id: string;
  old_password: string;
  new_password: string;
}

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  description: string;
  avatar_url: string;
  video_url: string;
  phone_number: string;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
}
