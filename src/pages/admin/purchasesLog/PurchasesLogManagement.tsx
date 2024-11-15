import React, { useState } from "react";
import PurchasesLog from "../../../components/admin/salesHistory/PurchasesLog";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import FilterStatus from "../../../components/admin/salesHistory/FilterStatus";
import { PurchaseStatus } from "../../../app/enums/purchase.status";
import RequestPurchasesAdminButton from "../../../components/admin/salesHistory/RequestPurchasesAdminButton";

const PurchasesLogManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [tempStatusFilter, setTempStatusFilter] = useState<PurchaseStatus | "">("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [instructorId, setInstructorId] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setStatusFilter(tempStatusFilter);
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

  const handleInstructorIdChange = (id: string) => {
    setInstructorId(id);
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <CustomSearch onSearch={handleSearch} placeholder="Search Purchases" className="search-input" />
        <div className="ml-2 mb-4">
          <RequestPurchasesAdminButton
            onRequestComplete={handleRequestComplete}
            disabled={selectedPurchases.size === 0}
            selectedPurchases={selectedPurchases}
            instructorId={instructorId}
          />
        </div>
        <div className="ml-auto mb-5">
          <FilterStatus onFilterChange={handleFilterChange} filterStatus={statusFilter} />
        </div>
      </div>
      <PurchasesLog 
        onSelectionChange={handleSelectionChange}
        onInstructorIdChange={handleInstructorIdChange}
        searchQuery={searchQuery} 
        statusFilter={statusFilter}
        refreshKey={refreshKey}
        instructorId={instructorId}
      />
    </div>
  );
};

export default PurchasesLogManagement;
