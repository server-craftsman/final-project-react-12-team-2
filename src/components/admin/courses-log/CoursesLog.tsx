import React, { useEffect, useState, useCallback } from "react";
import { Table, message } from "antd";
import { Blog, GetBlogResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import { BlogService } from "../../../services/blog/blog.service";
import { GetBlogParams } from "../../../models/api/request/admin/blog.request.model";

interface SearchBlogCondition {
  name: string;
  is_delete: boolean;
}

interface AdminBlogProps {
  searchQuery: string;
}

const AdminBlog: React.FC<AdminBlogProps> = ({ searchQuery }) => {
  const [blogData, setBlogData] = useState<GetBlogResponse | null>(null);

  const defaultParams: GetBlogParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10,
    },
    searchCondition: {
      name: "",
      is_delete: false,
    },
  };

  const getSearchCondition = useCallback(
    (searchQuery: string): SearchBlogCondition => ({
      name: searchQuery || defaultParams.searchCondition.name,
      is_delete: false,
    }),
    []
  );

  const fetchBlogs = useCallback(async () => {
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params: GetBlogParams = {
        pageInfo: defaultParams.pageInfo,
        searchCondition,
      };

      // Thêm console.log để kiểm tra tham số gửi đi và phản hồi
      console.log("Fetching blogs with params:", params);

      const response = await BlogService.getBlog(params);
      setBlogData(response.data.data);

      // Kiểm tra phản hồi từ API
      console.log("Response from BlogService.getBlog:", response);

      // if (response?.data) {
      //   setBlogData(response.data); 
      // } else {
      //   throw new Error("No data found in response");
      // }
    } catch (error) {
      message.error("An unexpected error occurred while fetching blogs");
      console.error("Error fetching blogs:", error); // In chi tiết lỗi vào console
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Filter blogs based on the search term
  const filteredData = blogData?.pageData?.filter((blog: Blog) =>
    (blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    {
      title: "Blog Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Author",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData || []}
      rowKey="_id" // Ensure a unique key for each row
    />
  );
};

export default AdminBlog;
