export interface SetCreateUserResponse {
  data: {
    name: string | null;
    password: string | null;
    email: string | null;
    role: string | null; // default: "student"
    description?: string | null;
    avatar_url?: string | null;
    video_url?: string | null;
    phone_number?: string | null;
    bank_name?: string | null;
    bank_account_no?: string | null;
    bank_account_name?: string | null;
  };
}
