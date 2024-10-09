import { lazy, useState } from 'react';

const SearchPayment = lazy(() => import('../../../components/admin/payout/SearchPayment'));
const AmountPayment = lazy(() => import('../../../components/admin/payout/AmountPayment'));
const ViewPayment = lazy(() => import('../../../components/admin/payout/ViewPayment'));

const ManagePayment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <SearchPayment onSearch={handleSearch} /> {/* Ô tìm kiếm payment */}
      <AmountPayment />
      <ViewPayment searchQuery={searchQuery} />
    </div>
  );
};

export default ManagePayment;
