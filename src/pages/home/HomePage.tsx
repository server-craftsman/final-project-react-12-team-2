import React from 'react';
import Introduction from '../../components/student/Introduction';
import Courses from '../../components/student/Courses';
import { Divider } from 'antd';
const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-indigo-50 to-white">
      <Introduction />
      <Divider className="my-16 border-indigo-200" />
      <Courses />
    </div>
  );
};

export default HomePage;