export interface CourseSidebarProps {
  course: any;
  discountedPrice?: string;
  courseStatus?: {
    is_in_cart?: boolean;
    is_purchased?: boolean;
  };
}
