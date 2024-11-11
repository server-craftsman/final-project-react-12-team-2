export interface Blog {
  _id: string;
  name: string;
  user_id: string;
  user_name: string;
  category_id: string;
  category_name: string;
  image_url: string;
  description: string;
  content: string;
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

export interface GetBlogResponse {
  pageData: Blog[];
  pageInfo: PageInfo;
}

export interface UpdateBlogParams {
  _id: string;
  name: string;
  user_id: string;
  category_id: string;
  image_url: string;
  description: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
export interface getPublicBlogsDetails {
  _id:	string
name:	string
user_id:	string
user_name:	string
category_id:	string
category_name:	string
image_url:	string
description:	string
content:	string
created_at:	Date
updated_at:	Date
is_deleted:	boolean
}