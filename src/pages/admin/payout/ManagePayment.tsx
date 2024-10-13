import { lazy, useState } from "react";

const SearchPayment = lazy(
  () => import("../../../components/admin/payout/SearchPayment"),
);
const AmountPayment = lazy(
  () => import("../../../components/admin/payout/AmountPayment"),
);
const ViewPayment = lazy(
  () => import("../../../components/admin/payout/ViewPayment"),
);

const ManagePayment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="items-center justify-center border-b border-gray-300 p-4">
      <SearchPayment onSearch={handleSearch} />
      <AmountPayment />
      <ViewPayment searchQuery={searchQuery} />
    </div>
  );
};

export default ManagePayment;
