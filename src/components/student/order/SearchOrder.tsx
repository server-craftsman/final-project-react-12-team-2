import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface SearchOrderProps {
  onSearch: (searchTerm: string) => void;
}

const SearchOrder: React.FC<SearchOrderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

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
