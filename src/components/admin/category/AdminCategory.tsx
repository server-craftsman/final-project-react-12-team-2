import { Button, Table, Input } from "antd";
import { useState } from "react";
import categoriesData from "../../../data/categories.json";
import { useNavigate } from "react-router-dom";
import { Category } from "../../../models/Category";

const { Search } = Input;

const AdminCategory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetails = (id: string) => {
    navigate(`/admin/categories/categories-details/${id}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Filter categories based on the search term
  const filteredData = categoriesData.categories.filter(
    (category: Category) => {
      return (
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
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
      title: "Parent Category ID",
      dataIndex: "parent_category_id",
      key: "parent_category_id",
    },
    {
      title: "Is Deleted",
      dataIndex: "is_deleted",
      key: "is_deleted",
      render: (isDeleted: boolean) => (isDeleted ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Category) => (
        <span>
          <Button
            type="primary"
            onClick={() => handleViewDetails(record.id)}
            className="bg-gradient-tone text-white"
          >
            View Details
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Search
        placeholder="Search by name or description"
        onSearch={handleSearch}
        style={{ marginBottom: 20 }}
      />
      <Table columns={columns} dataSource={filteredData} rowKey="id" />
    </div>
  );
};

export default AdminCategory;
