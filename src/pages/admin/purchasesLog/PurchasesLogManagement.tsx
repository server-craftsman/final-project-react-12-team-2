import React, { useState } from "react";
import PurchasesLog from "../../../components/admin/salesHistory/PurchasesLog";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import FilterStatus from "../../../components/admin/salesHistory/FilterStatus";
import { PurchaseStatus } from "../../../app/enums/purchase.status";
import RequestPurchasesAdminButton from "../../../components/admin/salesHistory/RequestPurchasesAdminButton";
import { DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";

const PurchasesLogManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [tempStatusFilter, setTempStatusFilter] = useState<PurchaseStatus | "">("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPurchases, setSelectedPurchases] = useState<Set<string>>(new Set());
  const [instructorId, setInstructorId] = useState<string>("");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [tempDates, setTempDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const handleSearch = (query: string, dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setSearchQuery(query);
    setStatusFilter(tempStatusFilter);
    setStartDate(dates ? dates[0] : null);
    setEndDate(dates ? dates[1] : null);
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
    setSelectedPurchases(new Set());
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleInstructorIdChange = (id: string) => {
    setInstructorId(id);
  };

  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setTempDates(dates);
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <CustomSearch onSearch={(query) => handleSearch(query, tempDates)} placeholder="Search Purchases" className="search-input" />
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
        <DatePicker.RangePicker
          className="w-full md:w-1/3 ml-auto mb-5"
          onChange={handleDateChange}
        />
      </div>
      <PurchasesLog 
        onSelectionChange={handleSelectionChange}
        onInstructorIdChange={handleInstructorIdChange}
        searchQuery={searchQuery} 
        statusFilter={statusFilter}
        refreshKey={refreshKey}
        instructorId={instructorId}
        startDate={startDate ? moment(startDate.toDate()) : null}
        endDate={endDate ? moment(endDate.toDate()) : null}
      />
    </div>
  );
};

export default PurchasesLogManagement;
