import { lazy, useState } from 'react';
const ViewUserProfile = lazy(() => import('../../../components/admin/user/ViewUserProfile'));
const SearchUser = lazy(() => import('../../../components/admin/user/SearchUser'));
const CreateUserProfile = lazy(() => import('../../../components/admin/user/CreateUserProfile'));

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
