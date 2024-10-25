import AdminCategory from "../../../components/admin/category/AdminCategory";
import CreateCategory from "../../../components/admin/category/CreateCategory";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { useState } from "react";
import { Card, Layout } from "antd";

const { Content } = Layout;
function ManageCategory() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Content>
      <Card
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <CustomSearch onSearch={(value) => setSearchTerm(value)} placeholder="Search by name or description" className="search-input" />
          <CreateCategory />
        </div>
        <AdminCategory searchTerm={searchTerm} />
      </Card>
    </Content>
  );
}

export default ManageCategory;
