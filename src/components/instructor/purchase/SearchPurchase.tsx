import React from "react";
import Search from "antd/es/input/Search";
import { Button } from "antd";

interface SearchPurchaseProps {
  onSearch: (value: string) => void;
  onRequest: () => void;
}

const SearchPurchase: React.FC<SearchPurchaseProps> = ({ onSearch, onRequest }) => {
  return (
    <div className="flex items-center mb-5">
      <Search
        className="w-96"
        placeholder="Search by purchase number"
        onSearch={onSearch}
      />
      <Button className="bg-gradient-tone text-white ml-8" onClick={onRequest}>
        Request
      </Button>
    </div>
  );
};

export default SearchPurchase;
