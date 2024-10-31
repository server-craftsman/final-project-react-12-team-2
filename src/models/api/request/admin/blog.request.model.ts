export interface GetBlogParams {
  searchCondition: {
    category_id: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export interface UpdateBlogParams {
  name: string;
  user_id: string;
  category_id: string;
  image_url: string;
  description: string;
  content: string;
}
