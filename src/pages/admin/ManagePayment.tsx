import { lazy, useState } from 'react';


const SearchPayment = lazy(() => import('../../components/admin/SearchPayment'));
const AmountPayment = lazy(() => import('../../components/admin/AmountPayment'));
const ViewPayment = lazy(() => import('../../components/admin/ViewPayment'));

const ManagePayment = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State để lưu trữ kết quả tìm kiếm

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <SearchPayment onSearch={handleSearch} /> {/* Ô tìm kiếm payment */}
      <AmountPayment></AmountPayment>
      <ViewPayment searchQuery={searchQuery} /> {/* Hiển thị chi tiết payment dựa trên tìm kiếm */}
    </div>
  );
};

export default ManagePayment;
