import React, { useState } from "react";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Content } from "antd/es/layout/layout";
import { Card } from "antd";
import CreateBlog from "../../../components/admin/blog/CreateBlog";
import DislayBlog from "../../../components/admin/blog/DisplayBlog";

const BlogManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  return (
    <Content>
      <Card>
        <div className="mb-4 flex justify-between">
          <CustomSearch className="search-input" placeholder="Search by blog name" onSearch={handleSearch} />
          <CreateBlog />
        </div>
        <DislayBlog searchQuery={searchTerm} />
      </Card>
    </Content>
  );
};

export default BlogManagement;
