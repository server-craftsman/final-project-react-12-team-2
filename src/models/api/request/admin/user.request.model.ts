import { UserRoles } from "../../../../app/enums";

export interface GetUsersAdminParams {
  searchCondition: {
    keyword?: string;
    role?: UserRoles | undefined;
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
  role: UserRoles;
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
  role: UserRoles;
  description: string | "";
  avatar_url: string;
  video_url: string;
  phone_number: string;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
}
export interface ReviewProfileInstructorParams {
  user_id: string;
  status: ReviewStatus;
  comment?: string;
}

export enum ReviewStatus {
  APPROVE = "approve",
  REJECT = "reject"
}
