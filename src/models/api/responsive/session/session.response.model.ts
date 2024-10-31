export interface SessionResponse {
  pageData: SessionResponsePageData[];
  pageInfo: SessionResponsePageInfo;
}

export interface DisplaySessionResponse {
  pageData: SessionResponsePageData;
  pageInfo: SessionResponsePageInfo;
}

export type SessionResponsePageData = {
  _id: string;
  name: string;
  user_id: string;
  course_id: string;
  description: string;
  position_order: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
};

export interface SessionResponsePageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateSessionResponse {
  _id: string;
  name: string;
  user_id: string;
  course_id: string;
  description: string;
  position_order: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
