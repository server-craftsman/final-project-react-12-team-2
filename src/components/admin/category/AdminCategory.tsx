import { Table, Space, message } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { GetCategoryResponse } from "../../../models/api/responsive/admin/category.responsive.model";
import { GetCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { CategoryService } from "../../../services/category/category.service";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import parse from "html-react-parser";

interface SearchCategoryCondition {
  keyword: string;
  is_parent: boolean;
  is_delete: boolean;
}

interface AdminCategoryProps {
  searchQuery: string;
}

const AdminCategory: React.FC<AdminCategoryProps> = ({ searchQuery }) => {
  const [category, setCategory] = useState<GetCategoryResponse | null>(null);

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      keyword: "",
      is_parent: false,
      is_delete: false,
    }
  } as const; // Make immutable

  // Memoize the search condition logic
  const getSearchCondition = React.useCallback((searchQuery: string): SearchCategoryCondition => {
    return {
      keyword: searchQuery || defaultParams.searchCondition.keyword,
      is_parent: false,
      is_delete: false,
    };
  }, []);

  const fetchCategories = React.useCallback(async () => {
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params = {
        pageInfo: defaultParams.pageInfo,
        searchCondition
      };
      const response = await CategoryService.getCategory(params as GetCategoryParams);
      setCategory(response.data?.data ? response.data.data : null);
    } catch (error) {
      message.error("An unexpected error occurred while fetching categories");
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // const handleDelete = (id: string) => {
  //   Modal.confirm({
  //     title: "Are you sure you want to delete this category?",
  //     onOk: () => {
  //       setCategories(categories.filter((category: Category) => category.id !== id));
  //       message.success("Category deleted successfully");
  //     }
  //   });
  // };

  // Filter categories based on the search term
  const filteredData = category?.pageData?.filter((category: Category) => {
    return (
      (category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <div className="prose max-w-none">{parse(description)}</div>
    },
    {
      title: "Action",
      key: "action",
      render: (record: Category) => (
        <Space size="middle">
          <Link to={`/admin/edit-category/${record._id}`}>
            <EditOutlined />
          </Link>
          <DeleteOutlined />
        </Space>
      )
    }
  ];

  return <Table columns={columns} dataSource={filteredData || []} rowKey="id" />;
};

export default AdminCategory;
