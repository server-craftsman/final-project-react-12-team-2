import React, { useState, lazy } from 'react';

const ViewPayment = lazy(() => import('../../../components/admin/payout/ViewPayment'));
const SearchPayment = lazy(() => import('../../../components/admin/payout/SearchPayment'));

const ManagePayment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <SearchPayment onSearch={handleSearch} /> 
      <ViewPayment searchQuery={searchQuery} />
    </div>
  );
};

export default ManagePayment;
