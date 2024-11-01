import React, { useEffect, useState, useCallback } from "react";
import { Modal, Space, Table, message } from "antd";
import { Blog, GetBlogResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import { BlogService } from "../../../services/blog/blog.service";
import { GetBlogParams } from "../../../models/api/request/admin/blog.request.model";
import { Course } from "../../../models/prototype/Course";
import { HttpException } from "../../../app/exceptions";
import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface SearchBlogCondition {
  name: string;
  is_delete: boolean;
}

interface AdminBlogProps {
  searchQuery: string;
  data?: Course[];
}

const AdminBlog: React.FC<AdminBlogProps> = ({ searchQuery }) => {
  const [blogData, setBlogData] = useState<GetBlogResponse | null>(null);
  const navigate = useNavigate();

  const defaultParams: GetBlogParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      name: "",
      is_delete: false
    }
  };

  const getSearchCondition = useCallback(
    (searchQuery: string): SearchBlogCondition => ({
      name: searchQuery || defaultParams.searchCondition.name,
      is_delete: false
    }),
    []
  );

  const fetchBlogs = useCallback(async () => {
    try {
      const searchCondition = getSearchCondition(searchQuery);
      const params: GetBlogParams = {
        pageInfo: defaultParams.pageInfo,
        searchCondition
      };

      console.log("Fetching blogs with params:", params);

      const response = await BlogService.getBlog(params);
      setBlogData(response.data.data);

      console.log("Response from BlogService.getBlog:", response);
    } catch (error) {
      message.error("An unexpected error occurred while fetching blogs");
      console.error("Error fetching blogs:", error);
    }
  }, [searchQuery, getSearchCondition]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDeleteBlog = useCallback(
    (blogId: string) => {
      Modal.confirm({
        title: "Are you sure you want to delete this blog?",
        onOk: async () => {
          try {
            const response = await BlogService.deleteBlog(blogId);
            if (response.data.success) {
              message.success("Blog deleted successfully.");
              window.location.reload();
            }
          } catch (error) {
            message.error(error instanceof HttpException ? error.message : "An error occurred while deleting the blog");
            console.error("Failed to delete blog:", error);
          }
        }
      });
    },
    [navigate]
  );

  const filteredData = blogData?.pageData?.filter((blog: Blog) => (blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())) || (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase())));

  const columns = [
    {
      title: "Blog Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name"
    },
    {
      title: "Author",
      dataIndex: "user_name",
      key: "user_name"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Action",
      key: "action",
      render: (record: Blog) => (
        <Space size="middle">
          <Link to={`/admin//${record._id}`}>
            <EditOutlined />
          </Link>
          <DeleteOutlined onClick={() => handleDeleteBlog(record._id)} />
        </Space>
      )
    }
  ];

  return <Table columns={columns} dataSource={filteredData || []} rowKey="_id" />;
};

export default AdminBlog;
