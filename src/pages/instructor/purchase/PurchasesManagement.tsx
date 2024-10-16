import React, { useState } from "react";
import ViewPurchase from "../../../components/instructor/purchase/ViewPurchase";
import FilterStatusPurchases from "../../../components/instructor/purchase/FilterStatusPurchases";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import RequestPurchases from "../../../components/instructor/purchase/RequestPurchases";

const PurchasesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleRequestComplete = () => {
    console.log("Purchases requested successfully");
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <CustomSearch onSearch={handleSearch} placeholder="Search Purchases" className="search-input"/>
        <FilterStatusPurchases onFilterChange={handleFilterChange} filterStatus={filterStatus} />
        <RequestPurchases onRequestComplete={handleRequestComplete} />
      </div>
      <ViewPurchase
        searchQuery={searchQuery}
        filterStatus={filterStatus}
      />
    </div>
  );
};

export default PurchasesManagement;
