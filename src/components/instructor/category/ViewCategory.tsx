import React, { useEffect, useState } from 'react'
import { Category, GetCategoryResponse } from '../../../models/api/responsive/admin/category.responsive.model';
import { CategoryService } from '../../../services/category/category.service';
import { message, Table } from 'antd';
import { GetCategoryParams } from '../../../models/api/request/admin/category.request.model';
import parse from 'html-react-parser';
import LoadingAnimation from '../../../app/UI/LoadingAnimation';

interface SearchCategoryCondition {
  keyword: string;
  is_parent: boolean;
  is_delete: boolean;
}

interface ViewCategoryProps {
  searchQuery: string;
}

const ViewCategory: React.FC<ViewCategoryProps> = ({ searchQuery }) => {
  const [category, setCategory] = useState<GetCategoryResponse | null>(null);
  const [pageInfo, setPageInfo] = useState<any>({});

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      keyword: "",
      is_parent: false,
      is_delete: false
    }
  } as const;

  const getSearchCondition = React.useCallback((searchQuery: string): SearchCategoryCondition => {
    return {
      keyword: searchQuery || defaultParams.searchCondition.keyword,
      is_parent: false,
      is_delete: false
    };
  }, []);

  const fetchCategories = React.useCallback(async (pageNum: number = defaultParams.pageInfo.pageNum, pageSize: number = defaultParams.pageInfo.pageSize) => {
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params = {
        pageInfo: { pageNum, pageSize },
        searchCondition
      };
      const response = await CategoryService.getCategory(params as GetCategoryParams);
      setCategory(response.data?.data ? response.data.data : null);
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      message.error("An unexpected error occurred while fetching categories");
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
    // Filter categories based on the search term
    const filteredData = category?.pageData?.filter((category: Category) => {
      return (category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase())) || (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const columns = [
      {
        title: "Category Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Parent Category",
        dataIndex: "parent_category_id",
        key: "parent_category_id",
        render: (parent_category_id: string) => {
          const parentCategory = category?.pageData?.find((category) => category._id === parent_category_id);
          return parentCategory ? parentCategory.name : "N/A";
        }
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (description: string) => <div className="prose max-w-none">{parse(description)}</div>
      }
    ];

if (category) {
  return (
    <>
      <Table 
      columns={columns} 
      dataSource={filteredData || []} 
      rowKey="_id" 
      pagination={{
        current: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
        total: pageInfo.totalItems,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, pageSize) => {
          fetchCategories(page, pageSize);
        },
        showSizeChanger: true,
        className: "bg-pagination",
        position: ["bottomLeft"]
      }}
       />
    </>
  );
} else {
  return <LoadingAnimation />;
}
}

export default ViewCategory;

