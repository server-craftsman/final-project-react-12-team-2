import { lazy, useState } from 'react';
const ViewUserProfile = lazy(() => import('../../components/admin/ViewUserProfile'));
const SearchUser = lazy(() => import('../../components/admin/SearchUser'));
const CreateUserProfile = lazy(() => import('../../components/admin/CreateUserProfile'));

const ManageUser = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className='p-4 justify-center items-center border-b border-gray-300'>
      <CreateUserProfile />
      <SearchUser onSearch={handleSearch} />
      <ViewUserProfile searchQuery={searchQuery} />
    </div>
  );
};

export default ManageUser;
