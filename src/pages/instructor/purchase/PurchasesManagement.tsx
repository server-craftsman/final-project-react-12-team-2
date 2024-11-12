import React, { useState } from "react";
import ViewPurchase from "../../../components/instructor/purchase/ViewPurchase";
import FilterStatusPurchases from "../../../components/instructor/purchase/FilterStatusPurchases";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import RequestPurchasesButton from "../../../components/instructor/purchase/RequestPurchasesButton";
import { PurchaseStatus } from "../../../app/enums/purchase.status";
const PurchasesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<PurchaseStatus | "">("");
  const [tempStatusFilter, setTempStatusFilter] = useState<PurchaseStatus | "">("");
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilterStatus(tempStatusFilter);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleFilterChange = (status: PurchaseStatus | "") => {
    setTempStatusFilter(status);
  };

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedPurchases(selected);
  };

  const handleRequestComplete = () => {
    console.log("Purchases requested successfully");
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <CustomSearch onSearch={handleSearch} placeholder="Search Purchases" className="search-input" />
        <div className="ml-2 mb-4">
          <RequestPurchasesButton
            onRequestComplete={handleRequestComplete}
            disabled={selectedPurchases.size === 0}
            selectedPurchases={selectedPurchases}
          />
        </div>
        <div className="ml-auto mb-5">
          <FilterStatusPurchases onFilterChange={handleFilterChange} filterStatus={tempStatusFilter} />
        </div>
      </div>
      <ViewPurchase
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSelectionChange={handleSelectionChange}
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default PurchasesManagement;
