export interface GetCurrentUserResponse {
  success: boolean;
  data: {
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
    verification_token_expires: string;
    token_version: number;
    balance: number;
    balance_total: number;
    bank_name: string;
    bank_account_no: string;
    bank_account_name: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    __v: number;
  };
}

export interface RegisterGooglePublicResponse {
  success: boolean;
  data: {
    email: string;
    name: string;
    google_id: string;
    role: string;
    status: boolean;
    description: string;
    phone_number: string;
    avatar_url: string;
    video_url: string;
    is_verified: boolean;
    token_version: number;
    balance: number;
    balance_total: number;
    bank_name: string;
    bank_account_no: string;
    bank_account_name: string;
    is_deleted: boolean;
    _id: string;
    dob: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
}

export interface GetBankResponse {
  code: string;
  desc: string;
  data: {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
  }[];
}
