import { Table, Space, Modal, message } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import categoriesData from "../../../data/categories.json";
// import { useNavigate } from "react-router-dom";
import { Category } from "../../../models/prototype/Category";
import { Link } from "react-router-dom";

const AdminCategory = ({ searchTerm }: { searchTerm: string }) => {
  // const navigate = useNavigate();
  const [categories, setCategories] = useState(categoriesData.categories);

  // const handleViewDetails = (id: string) => {
  //   navigate(`/admin/categories/categories-details/${id}`);
  // };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      onOk: () => {
        setCategories(
          categories.filter((category: Category) => category.id !== id),
        );
        message.success("Category deleted successfully");
      },
    });
  };

  // Filter categories based on the search term
  const filteredData = categories.filter((category: Category) => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (record: Category) => (
        <Space size="middle">
          <Link to={`/admin/edit-category/${record.id}`}>
            <EditOutlined />
          </Link>
          <DeleteOutlined onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={filteredData} rowKey="id" />;
};

export default AdminCategory;
