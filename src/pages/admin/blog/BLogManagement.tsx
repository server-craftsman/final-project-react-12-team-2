import React, { useState } from "react";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Content } from "antd/es/layout/layout";
import { Card } from "antd";
import DislayBlog from "../../../components/admin/blog/DisplayBlog";

const BlogManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  return (
    <Content>
      <Card>
        <div className="mb-4">
          <CustomSearch 
            className="search-input" 
            placeholder="Search by blog name" 
            onSearch={handleSearch} />
        </div>
        <DislayBlog searchQuery={searchTerm} />
      </Card>
    </Content>
  );
};

export default BlogManagement;
