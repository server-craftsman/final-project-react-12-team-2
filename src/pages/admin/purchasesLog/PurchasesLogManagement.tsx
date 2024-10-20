import React, { useState } from "react";
import PurchasesLog from "../../../components/admin/purchasesLog/PurchasesLog";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Card } from "antd";
import { Content } from "antd/es/layout/layout";
import FilterStatus from "../../../components/admin/purchasesLog/FilterStatus";

const PurchasesLogManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Content>
      <Card>
        <div className="mb-4 flex justify-between">
          <CustomSearch
            onSearch={handleSearch}
            placeholder="Search Purchase"
            className="search-input"
          />
          <FilterStatus status={statusFilter} setStatus={setStatusFilter} />
        </div>
        <PurchasesLog searchQuery={searchQuery} statusFilter={statusFilter} />
      </Card>
    </Content>
  );
};

export default PurchasesLogManagement;
