export interface Category {
    id: string
    user_id: string
    name: string
    description: string
    parent_category_id: string
    created_at: Date
    updated_at: Date
    is_deleted: boolean
}