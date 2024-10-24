export interface GetCreateUserResponse {
  success: boolean;
  data: {
    _id: string | null;
    name: string | null;
    email: string | null;
    google_id: string | null;
    status: boolean;
    description?: string | null;
    phone_number?: string | null;
    avatar_url?: string | null;
    video_url?: string | null;
    is_verified: boolean;
    balance: number | null;
    balance_total: number | null;
    bank_name?: string | null;
    bank_account_no?: string | null;
    bank_account_name?: string | null;
    dob: Date | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_deleted: boolean;
  };
}
