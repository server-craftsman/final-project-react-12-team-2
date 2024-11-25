export interface User {
  _id: string;
  email: string;
  name: string;
  google_id: string;
  role: string;
  status: boolean;
  description: string;
  phone_number: string;
  avatar_url: string;
  video_url: string;
  dob: Date;
  is_verified: boolean;
  verification_token: string;
  verification_token_expires: Date;
  token_version: number;
  balance: number;
  balance_total: number;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  __v: number;
  is_subscribed?: boolean;
}

export interface ChangePasswordResponse {
  message: string;
  data: string;
}
