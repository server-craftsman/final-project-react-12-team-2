export interface Review {
  id: string;
  course_id: string;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
