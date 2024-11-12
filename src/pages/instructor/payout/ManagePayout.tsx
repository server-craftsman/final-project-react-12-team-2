import React, { useState } from "react";
import InstructorPayout from "../../../components/instructor/payout/InstructorPayout";
import FilterStatus from "../../../components/instructor/payout/FilterPayoutStatus";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import RequestPayoutButton from "../../../components/instructor/payout/RequestPayoutButton";
import { PayoutStatus } from "../../../app/enums/payout.status";

const ManagePayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<PayoutStatus | "">("");
  const [tempStatusFilter, setTempStatusFilter] = useState<PayoutStatus | "">("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());
  const [selectedPayoutId, setSelectedPayoutId] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilterStatus(tempStatusFilter);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleRequestPayout = () => {
    console.log("Request Payout");
    setRefreshKey(prevKey => prevKey + 1);
  };
  
  const handleFilterChange = (status: PayoutStatus | "") => {
    setTempStatusFilter(status);
  };


  return (
    <>
        <div className="flex items-center mb-4">
          <CustomSearch onSearch={handleSearch} placeholder="Search Payout" className="search-input" />
          <div className="ml-2 mb-4">
            <RequestPayoutButton 
              onRequestComplete={handleRequestPayout}
              disabled={selectedPayouts.size === 0} 
              payoutId={selectedPayoutId} 
            />
          </div>
          <div className="ml-auto mb-5">
            <FilterStatus onFilterChange={handleFilterChange} filterStatus={tempStatusFilter} />
          </div>
        </div>
      <InstructorPayout
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        updateSelectedPayouts={setSelectedPayouts}
        setSelectedPayoutId={setSelectedPayoutId}
        refreshKey={refreshKey}
      />
    </>
  );
};

export default ManagePayout;
