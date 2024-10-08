export interface Session {
    id: string;
    name: string;
    course_id: string;
    user_id: string;
    description: string;
    position_order: number;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}