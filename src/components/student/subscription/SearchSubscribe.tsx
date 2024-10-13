import React, { useState } from "react";
import { Input } from "antd";

const { Search } = Input;

interface SearchSubscribeProps {
  onSearch: (value: string) => void;
}

const SearchSubscribe: React.FC<SearchSubscribeProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <Search
        placeholder="Search by instructor name or email"
        allowClear
        enterButton="Search"
        size="large"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default SearchSubscribe;
