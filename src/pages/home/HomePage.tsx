import React from 'react';
import { useContext } from 'react';
import Introduction from '../../components/student/Introduction';
import Courses from '../../components/student/Courses';
import Categories from '../../components/student/Categories';
import { Divider } from 'antd';
import { AuthContext } from '../../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-indigo-50 to-white">
      <>
          <Introduction />
          <Divider className="my-16 border-indigo-200" />
          <Categories />
          <Divider className="my-16 border-indigo-200" />
          <Courses />
      </>
    </div>
  );
};

export default HomePage;