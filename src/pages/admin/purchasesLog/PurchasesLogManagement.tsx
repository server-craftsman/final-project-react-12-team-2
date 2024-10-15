import React, { useState } from "react";
import PurchasesLog from "../../../components/admin/purchasesLog/PurchasesLog";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import { Card } from "antd";
import { Content } from "antd/es/layout/layout";

const PurchasesLogManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Content>
      <Card>
        <CustomSearch onSearch={handleSearch} placeholder="Search Purchase" className="search-input" />
        <PurchasesLog searchQuery={searchQuery} />
      </Card>
    </Content>
  );
};

export default PurchasesLogManagement;
