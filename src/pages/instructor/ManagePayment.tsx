import { lazy, useState } from 'react';


const ViewPaymentDetails = lazy(() => import('../../components/admin/ViewPaymentDetails'));
const SearchPayment = lazy(() => import('../../components/admin/SearchPayment'));

const ManagePayment = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <SearchPayment onSearch={handleSearch} /> 
      <ViewPaymentDetails searchQuery={searchQuery} />
    </div>
  );
};

export default ManagePayment;
