import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSearch: React.FC<SearchProps> = ({ onSearch, placeholder = "Search...", className }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className={className}>
      <Input
        placeholder={placeholder}
        suffix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default CustomSearch;
