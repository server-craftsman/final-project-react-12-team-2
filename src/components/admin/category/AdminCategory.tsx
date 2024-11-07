import { Table, Space, message, Modal, Button } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GetCategoryResponse } from "../../../models/api/responsive/admin/category.responsive.model";
import { GetCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { CategoryService } from "../../../services/category/category.service";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import parse from "html-react-parser";
import { HttpException } from "../../../app/exceptions";

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
  const navigate = useNavigate();

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
  } as const; // Make immutable

  // Memoize the search condition logic
  const getSearchCondition = React.useCallback((searchQuery: string): SearchCategoryCondition => {
    return {
      keyword: searchQuery || defaultParams.searchCondition.keyword,
      is_parent: false,
      is_delete: false
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

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      Modal.confirm({
        title: "Are you sure you want to delete this category?",
        onOk: async () => {
          try {
            const response = await CategoryService.deleteCategory(categoryId);
            if (response.data.success) {
              window.location.reload();
              message.success("Category deleted successfully.");
            }
          } catch (error) {
            message.error(error instanceof HttpException ? error.message : "An error occurred while deleting the category");
            console.error("Failed to delete category:", error);
          }
        }
      });
    },
    [navigate]
  );

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
    },
    {
      title: "Action",
      key: "action",
      render: (record: Category) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/edit-category/${record._id}`)} className="mr-2 bg-white text-blue-500 hover:opacity-80" />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCategory(record._id)} className="mr-2 bg-white text-red-500 hover:opacity-80" />
        </Space>
      )
    }
  ];

  return <Table columns={columns} dataSource={filteredData || []} rowKey="id" />;
};

export default AdminCategory;
