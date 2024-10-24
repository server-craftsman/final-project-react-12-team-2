import { UserRole } from "../../../prototype/User";

export interface RegisterStudentPublicParams {
  google_id: string;
  description: string;
  phone_number: string;
  role: UserRole;
}

export interface RegisterInstructorPublicParams {
  google_id: string;
  description: string;
  phone_number: string;
  avatar_url: string;
  video_url: string;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
  role: UserRole;
}
