export interface GetCartItemsParams {
  searchCondition: {
    status: string;
    is_delete: boolean;
  };
  pageInfo: {
    pageNum: number;
    pageSize: number;
  };
}

export interface UpdateCartStatusParams {
  status: string;
  items: {
    _id: string;
    cart_no: string;
  }[];
}
