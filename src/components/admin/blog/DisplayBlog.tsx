// DislayBlog.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Space, message } from "antd";
import { Blog, GetBlogResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import { BlogService } from "../../../services/blog/blog.service";
import { CategoryService } from "../../../services/category/category.service";
import { Link } from "react-router-dom";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import EditBlogModal from "./EditBlog";
import DeleteBlogModal from "./DeleteBlog";
import CreateBlog from './CreateBlog';

const DislayBlog: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [blogData, setBlogData] = useState<GetBlogResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const defaultParams = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    searchCondition: {
      name: "",
      user_id: "",
      category_id: "",
      description: "",
      image_url: "",
      content: "",
      keyword: "",
      is_parent: true,
      is_delete: false
    }
  };

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await BlogService.getBlog({
        pageInfo: { pageNum: 1, pageSize: 10 },
        searchCondition: { name: searchQuery, is_delete: false }
      });
      setBlogData(response.data.data);
    } catch (error) {
      message.error("An unexpected error occurred while fetching blogs");
    }
  }, [searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await CategoryService.getPublicCategory(defaultParams);
      const pageData = response.data.data.pageData;

      if (Array.isArray(pageData)) {
        setCategories(pageData);
      } else {
        console.error("Expected an array of categories, but got:", pageData);
      }
    } catch (error) {
      message.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [searchQuery, fetchBlogs, fetchCategories]);

  const filteredData = blogData?.pageData?.filter((blog: Blog) => (blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())) || (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase())));

  const columns = [
    {
      title: "Blog Name",
      dataIndex: "name",
      render: (text: string, record: Blog) => <Link to={`/admin/blog/${record._id}`}>{text}</Link>
    },
    {
      title: "Category Name",
      dataIndex: "category_name"
    },
    {
      title: "Author",
      dataIndex: "user_name"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Action",
      key: "action",
      render: (record: Blog) => (
        <Space size="middle">
          <EditTwoTone
            onClick={() => {
              setSelectedBlog(record);
              setEditModalVisible(true);
            }}
          />
          <DeleteTwoTone
            onClick={() => {
              setSelectedBlog(record);
              setDeleteModalVisible(true);
            }}
          />
        </Space>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="search-container">
          {/* Component Search của bạn */}
        </div>
        
        <CreateBlog 
          onSuccess={fetchBlogs} 
          className="bg-gradient-tone px-4 py-2 text-white"
        />
      </div>

      <Table columns={columns} dataSource={filteredData || []} rowKey="_id" />

      <EditBlogModal visible={isEditModalVisible} blog={selectedBlog} categories={categories} onClose={() => setEditModalVisible(false)} onSuccess={fetchBlogs} />

      <DeleteBlogModal visible={isDeleteModalVisible} blogId={selectedBlog?._id || null} onClose={() => setDeleteModalVisible(false)} onSuccess={fetchBlogs} />
    </>
  );
};

export default DislayBlog;
