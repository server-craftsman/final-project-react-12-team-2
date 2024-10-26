import { UserRole } from "../../../prototype/User";
import { UserRoles } from "../../../../app/enums";
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

export interface RegisterParams {
  name: string;
  password: string;
  email: string;
  role: UserRoles;
  description?: string;
  avatar_url?: string;
  video_url?: string;
  phone_number?: string;
  bank_name?: string;
  bank_account_no?: string;
  bank_account_name?: string;
}
