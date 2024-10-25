import { lazy, useState, Suspense } from "react";

// Ensure that CustomSearch and ViewRequestAccount are default exports in the respective modules
const CustomSearch = lazy(() => import("../../../components/generic/search/CustomSearch"));

const ViewRequestAccount = lazy(() => import("../../../components/admin/request-account/ViewRequestAccount"));

const FilterRequestAccount = lazy(() => import("../../../components/admin/request-account/FilterRequestAccount"));

const RequestAccountManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Ensure the correct type
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  // Handler for search input change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="items-center justify-center border-b border-gray-300">
      <div className="flex flex-col items-center p-4 md:flex-row">
        {/* Search Input */}
        <Suspense fallback={<div>Loading search component...</div>}>
          <CustomSearch
            onSearch={handleSearch} // Function to handle search input changes
            placeholder="Search by name or email" // Placeholder for search input
            className="search-input mr-4" // Custom styling classes
          />
        </Suspense>
        <FilterRequestAccount
          onStatusChange={setSelectedStatus} // Directly pass the setSelectedStatus function
        />
      </div>

      {/* View Request Account List */}
      <Suspense fallback={<div>Loading request account list...</div>}>
        <ViewRequestAccount
          searchQuery={searchQuery} // Pass the search query state to filter data
          selectedStatus={selectedStatus} // You can update this if you need to handle different statuses
        />
      </Suspense>
    </div>
  );
};

export default RequestAccountManagement;
