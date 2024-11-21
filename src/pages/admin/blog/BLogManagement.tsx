import React, { useState, useCallback } from "react";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Content } from "antd/es/layout/layout";
import { Card } from "antd";
import CreateBlog from "../../../components/admin/blog/CreateBlog";
import DislayBlog from "../../../components/admin/blog/DisplayBlog";

const BlogManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (searchTerm: string) => {
    setRefreshKey(prevKey => prevKey + 1);
    setSearchTerm(searchTerm);
  };

  // Function to refresh the blog list
  const refreshBlogList = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  return (
    <Content>
      <Card>
        <div className="mb-4 flex justify-between">
          <CustomSearch className="search-input" placeholder="Search by blog name" onSearch={handleSearch} />
          <CreateBlog onBlogCreated={refreshBlogList} />
        </div>
        <DislayBlog searchQuery={searchTerm} refreshKey={refreshKey} />
      </Card>
    </Content>
  );
};

export default BlogManagement;
