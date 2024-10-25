import React, { useState } from "react";
import ViewPurchase from "../../../components/instructor/purchase/ViewPurchase";
import FilterStatusPurchases from "../../../components/instructor/purchase/FilterStatusPurchases";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import RequestPurchasesButton from "../../../components/instructor/purchase/RequestPurchasesButton";

const PurchasesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(
    new Set(),
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedPurchases(selected);
  };

  const handleRequestComplete = () => {
    console.log("Purchases requested successfully");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <CustomSearch
          onSearch={handleSearch}
          placeholder="Search Purchases"
          className="search-input"
        />
        <RequestPurchasesButton
          onRequestComplete={handleRequestComplete}
          disabled={selectedPurchases.size === 0}
        />
        <FilterStatusPurchases
          onFilterChange={handleFilterChange}
          filterStatus={filterStatus}
        />
      </div>
      <ViewPurchase
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSelectionChange={handleSelectionChange}
      />
      <button
        disabled={selectedPurchases.size === 0}
        onClick={() => console.log("Create Payout clicked")}
      >
        Create Payout
      </button>
    </div>
  );
};

export default PurchasesManagement;
