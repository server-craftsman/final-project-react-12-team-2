import { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchReviewProps } from '../../../models/objects/SearchReviewProps';

const SearchReview: React.FC<SearchReviewProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div>
      <Input
        placeholder="Search by Course Name"
        suffix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: 16 }}
      />
    </div>
  );
};

export default SearchReview;
