import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const SearchOrder = ({
  onSearch,
}: {
  onSearch: (searchTerm: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div>
      <Input
        placeholder="Search orders..."
        suffix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchOrder;
