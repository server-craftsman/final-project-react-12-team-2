import { Input } from 'antd';

interface SearchPurchaseProps {
  onSearch: (query: string) => void; // Hàm callback để xử lý tìm kiếm
}

const SearchPurchase = ({ onSearch }: SearchPurchaseProps) => {
  return (
    <Input
      placeholder="Search Purchases"
      onChange={(e) => onSearch(e.target.value)}
      style={{ marginBottom: '20px' }}
    />
  );
};

export default SearchPurchase;
