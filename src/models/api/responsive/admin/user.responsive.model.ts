export interface User {
  _id: string;
  name: string;
  email: string;
  google_id: string;
  role: string;
  status: boolean;
  description: string;
  phone_number: string;
  avatar_url: string;
  video_url: string;
  dob: Date;
  is_verified: boolean;
  balance: number;
  balance_total: number;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetUsersAdminResponse {
  pageData: User[];
  pageInfo: PageInfo;
}
