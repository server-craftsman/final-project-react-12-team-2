import { Card } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState } from "react";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import CourseLog from "../../../components/admin/courseLog/CourseLog";
import FilterStatus from "../../../components/admin/courseLog/FilterStatus";

const CourseLogManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [tempStatusFilter, setTempStatusFilter] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setRefreshKey(prevKey => prevKey + 1);
    setStatusFilter(tempStatusFilter);
  };
  const handleStatusFilter = (status: string) => {
    setTempStatusFilter(status);
  };
  return (
    <Content>
      <Card>
        <div className="mb-4 flex justify-between">
          <CustomSearch onSearch={handleSearch} placeholder="Search Course" className="search-input" />
          <FilterStatus status={statusFilter} onStatusChange={handleStatusFilter} />
        </div>
        <CourseLog searchQuery={searchQuery} statusFilter={statusFilter} refreshKey={refreshKey} />
      </Card>
    </Content>
  );
};

export default CourseLogManagement;
