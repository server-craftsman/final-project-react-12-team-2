export interface UpdateUserParams {
  email: string;
  name: string;
  description: string;
  phone_number: string;
  avatar_url: string;
  video_url: string;
  bank_name: string;
  bank_account_no: string;
  bank_account_name: string;
  dob: string;
}

export interface ChangePasswordParams {
  user_id: string;
  old_password: string;
  new_password: string;
}

