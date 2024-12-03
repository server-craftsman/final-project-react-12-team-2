// DisplayBlog.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Table, Space, Button } from "antd";
import { Blog, GetBlogResponse } from "../../../models/api/responsive/admin/blog.responsive.model";
import { BlogService } from "../../../services/blog/blog.service";
import { CategoryService } from "../../../services/category/category.service";
import { EditOutlined, DeleteOutlined} from "@ant-design/icons";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import EditBlogModal from "./EditBlog";
import DeleteBlogModal from "./DeleteBlog";
import BlogDetail from "./BlogDetail";
import { helpers } from "../../../utils";
import { ColumnType } from "antd/es/table";
import { GetCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { notificationMessage } from "../../../utils/helper";

const DisplayBlog: React.FC<{ searchQuery: string, refreshKey: number }> = ({ searchQuery, refreshKey }) => {
  const [blogData, setBlogData] = useState<GetBlogResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [pageInfo, setPageInfo] = useState<any>({});

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

  const getParentCategoryParams: GetCategoryParams = {
    searchCondition: {
      keyword: "",
      is_delete: false,
      is_parent: true
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100
    }
  };

  const getChildCategoryParams: GetCategoryParams = {
    searchCondition: {
      keyword: "",
      is_delete: false,
      is_parent: false
    },
    pageInfo: {
      pageNum: 1,
      pageSize: 100
    }
  };

  const fetchBlogs = useCallback(async (pageNum: number = defaultParams.pageInfo.pageNum, pageSize: number = defaultParams.pageInfo.pageSize) => {
    try {
      const response = await BlogService.getBlog({
        pageInfo: { pageNum, pageSize },
        searchCondition: { name: searchQuery, is_delete: false }
      });
      setBlogData(response.data.data);
      setPageInfo(response.data.data.pageInfo);
    } catch (error) {
      notificationMessage("An unexpected error occurred while fetching blogs", "error");
    }
  }, [searchQuery, refreshKey]);

  const fetchCategories = useCallback(async () => {
     try {
      const parentCategoriesData = await CategoryService.getCategory(getParentCategoryParams);
      const parentCategories = parentCategoriesData.data.data.pageData;

      const childCategoriesData = await CategoryService.getCategory(getChildCategoryParams);
      const childCategories = childCategoriesData.data.data.pageData;

      const categoriesWithChildren = parentCategories.map((parent) => ({
        ...parent,
        children: childCategories.filter((child) => child.parent_category_id === parent._id)
      }));

      setCategories(categoriesWithChildren);
    } catch (error) {
      notificationMessage("Failed to load categories.", "error");
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [searchQuery, refreshKey, refreshKey, fetchBlogs, fetchCategories]);
  const filteredData = blogData?.pageData?.filter((blog: Blog) => (blog.name && blog.name.toLowerCase().includes(searchQuery.toLowerCase())) || (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase())));

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_: any, __: Blog, index: number) => index + 1,
    },
    {
      title: "Blog Name",
      dataIndex: "name",
      render: (text: string, record: Blog) => {
        return (
          <a onClick={() => {
            setSelectedBlog(record);
            setDetailModalVisible(true);
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#0080ff', textDecoration: 'underline' }}>
              <img src={record.image_url} alt={text} style={{ width: 100, height: 100, marginRight: 10 }} />
              {text}
            </div>
          </a>
        );
      }
    },
    {
      title: "Category Name",
      dataIndex: "category_name"
    },
    {
      title: "Author",
      dataIndex: "user_name",
      render: (text: string, record: Blog) => {
        const avatarUrl = record.user_name[0] || "U";
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`https://ui-avatars.com/api/?name=${avatarUrl}`} alt={avatarUrl} className="w-12 h-12 rounded-full mr-4" />
            {text}
          </div>
        );
      }
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: string) => {
        const limitedText = text.length > 80 ? text.substring(0, 80) + "..." : text;
        return <div style={{ textAlign: "left" }} dangerouslySetInnerHTML={{ __html: limitedText }} />;
      }
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date: string) => helpers.formatDate(new Date(date))
    },
    {
      title: "Action",
      key: "action",
      render: (record: Blog) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            className="mr-2 bg-white text-blue-500 hover:opacity-80"
            onClick={() => {
              setSelectedBlog(record);
              setEditModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            className="mr-2 bg-white text-red-500 hover:opacity-80"
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
      <Table columns={columns as ColumnType<any>[]} dataSource={filteredData || []} rowKey="_id" 
      pagination={{
        current: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
        total: pageInfo.totalItems,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, pageSize) => {
          fetchBlogs(page, pageSize);
        },
        showSizeChanger: true,
        className: "bg-pagination",
        position: ["bottomLeft"]
        }}
      />

      <EditBlogModal visible={isEditModalVisible} blog={selectedBlog} categories={categories} onClose={() => setEditModalVisible(false)} onSuccess={fetchBlogs} />

      <DeleteBlogModal visible={isDeleteModalVisible} blogId={selectedBlog?._id || null} onClose={() => setDeleteModalVisible(false)} onSuccess={fetchBlogs} />

      <BlogDetail visible={isDetailModalVisible} onClose={() => setDetailModalVisible(false)} blogId={selectedBlog?._id || null} />
    </>
    );
};

export default DisplayBlog;
