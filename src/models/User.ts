export interface User {
    id: string
    email: string
    password: string
    name: string
    google_id: string
    role: string
    status: boolean
    description: string
    phone_number: string
    avatar_url: string | null
    video_url: string | null
    dob: string
    is_verified: boolean
    verification_token: string | null
    verification_token_expires: string | null
    token_version: number
    balance: number
    balance_total: number
    withdrawn_amount: number
    bank_name: string
    bank_account_no: string
    bank_account_name: string
    created_at: string
    updated_at: string
    is_deleted: boolean
}