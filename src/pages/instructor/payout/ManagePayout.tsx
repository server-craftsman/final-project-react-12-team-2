import React, { useState } from "react";
import InstructorPayout from "../../../components/instructor/payout/InstructorPayout";
import FilterStatus from "../../../components/instructor/payout/FilterPayoutStatus";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import RequestPayoutButton from "../../../components/instructor/payout/RequestPayoutButton";
const ManagePayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());

  const handleRequestPayout = () => {
    console.log("Request Payout");
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <CustomSearch onSearch={handleSearch} placeholder="Search Payout" className="search-input" />
        <RequestPayoutButton onClick={handleRequestPayout} disabled={selectedPayouts.size === 0} />
        <FilterStatus filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
      </div>
      <InstructorPayout searchQuery={searchQuery} filterStatus={filterStatus} updateSelectedPayouts={setSelectedPayouts} />
    </>
  );
};

export default ManagePayout;
