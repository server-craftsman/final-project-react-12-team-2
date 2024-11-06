import React, { useState } from "react";
import CustomSearch from "../../../components/generic/search/CustomSearch";

import { Content } from "antd/es/layout/layout";
import { Card } from "antd";
import CreateBlog from "../../../components/admin/blog/CreateBlog";
import DislayBlog from "../../../components/admin/blog/DisplayBlog";

const CoursesLogManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Content>
      <Card>
        <div className="mb-4 flex justify-between">
          <CustomSearch className="search-input" placeholder="Search by course name" onSearch={(value) => setSearchTerm(value)} />

          <CreateBlog />
        </div>
        <DislayBlog searchQuery={searchTerm} />
      </Card>
    </Content>
  );
};

export default CoursesLogManagement;
