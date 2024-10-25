export enum UserRole {
  admin = "admin",
  student = "student",
  instructor = "instructor",
  all = "all"
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  google_id: string | null;
  role: UserRole;
  status: boolean;
  description: string;
  phone_number: string;
  avatar_url: string | null;
  video_url: string | null;
  dob: Date;
  is_verified: boolean;
  balance: number;
  balance_total: number;
  withdrawn_amount: number;
  bank_name: string | null;
  bank_account_no: string | null;
  bank_account_name: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
export interface Token {
  verification_token: string | null;
  verification_token_expires: string | null;
  token_version: number;
}
