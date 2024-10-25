import { Input } from "antd";
import React, { useState } from "react";

const SearchPurchaseLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <Input.Search placeholder="Search Purchase Log" allowClear value={searchTerm} onChange={handleSearchChange} style={{ width: 300, marginBottom: 16 }} />
    </div>
  );
};

export default SearchPurchaseLog;
