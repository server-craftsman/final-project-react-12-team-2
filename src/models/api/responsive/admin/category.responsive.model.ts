export interface Category {
  _id: string;
  name: string;
  parent_category_id: string | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface GetCategoryResponse {
  pageData: Category[];
  pageInfo: PageInfo;
}

export interface GetCategoryResponsePublic {
  pageData: Category;
  pageInfo: PageInfo;
}

export interface CreateCategoryResponse {
  _id: string;
  name: string;
  parent_category_id: string | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

export interface UpdateCategoryResponse {
  _id: string;
  name: string;
  parent_category_id: string | null;
  description: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
