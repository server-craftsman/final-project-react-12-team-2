import { lazy, useState } from 'react';

// Lazy loading các component
const SearchPurchase = lazy(() => import('../../../components/admin/purchases/SearchPurchase'));
const AmountPurchase = lazy(() => import('../../../components/admin/purchases/AmountPurchase'));
const ViewPurchase = lazy(() => import('../../../components/admin/purchases/ViewPurschase'));

const ManagePurchase = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State để lưu trữ kết quả tìm kiếm

  // Hàm xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <SearchPurchase onSearch={handleSearch} /> {/* Ô tìm kiếm purchase */}
      <AmountPurchase /> {/* Thành tiền purchase */}
      <ViewPurchase searchQuery={searchQuery} /> {/* Hiển thị chi tiết purchase dựa trên tìm kiếm */}
    </div>
  );
};

export default ManagePurchase;
