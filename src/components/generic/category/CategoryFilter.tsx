import React from 'react';
import { Tabs } from 'antd';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = ['All Courses', 'WEB DEVELOPMENT', 'ARTIFICIAL INTELLIGENCE', 'DATA SCIENCE', 'PROGRAMMING LANGUAGES'];

  const items = categories.map(category => ({
    key: category,
    label: (
      <span className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg text-indigo-900 hover:text-[#8529ff] transition-colors duration-300">
        {category}
      </span>
    ),
  }));

  return (
    <div className='flex justify-center items-center w-full overflow-x-auto'>
      <Tabs
        activeKey={activeCategory}
        onChange={onCategoryChange}
        items={items}
        centered
        className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 w-full"
        tabBarStyle={{
          borderBottom: '2px solid #8529ff',
          fontFamily: 'Playfair Display, serif',
          fontSize: '14px',
          color: '#8529ff'
        }}
        tabBarGutter={8}
      />
    </div>
  )
}

export default CategoryFilter;
