import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchPayment = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(query);
    }, 300); // Delay for debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  return (
    <div className="mb-4 flex items-center">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search payment..."
        suffix={<SearchOutlined />}
        className="border rounded-md"
      />
    </div>
  );
};

export default SearchPayment;
