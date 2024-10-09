import { lazy, useState } from 'react';

// Lazy loading các component
// const ViewPaymentDetails = lazy(() => import('../../components/admin/ViewPaymentDetails'));
const ViewPayment = lazy(() => import('../../components/admin/ViewPayment'));
const SearchPayment = lazy(() => import('../../components/admin/SearchPayment'));

const ManagePayment = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State để lưu trữ kết quả tìm kiếm

  // Hàm xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <SearchPayment onSearch={handleSearch} /> {/* Ô tìm kiếm payment */}
      <ViewPayment searchQuery={searchQuery} /> {/* Hiển thị chi tiết payment dựa trên tìm kiếm */}
    </div>
  );
};

export default ManagePayment;
