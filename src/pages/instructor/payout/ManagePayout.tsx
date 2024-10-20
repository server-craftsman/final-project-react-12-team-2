import React, { useState } from "react";
import InstructorPayout from "../../../components/instructor/payout/InstructorPayout";
import FilterStatus from "../../../components/instructor/payout/FilterPayoutStatus";
import CustomSearch from "../../../components/generic/search/CustomSearch";

const ManagePayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <CustomSearch
          onSearch={handleSearch}
          placeholder="Search Payout"
          className="search-input"
        />
        <FilterStatus
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>
      <InstructorPayout searchQuery={searchQuery} filterStatus={filterStatus} />
    </div>
  );
};

export default ManagePayout;
