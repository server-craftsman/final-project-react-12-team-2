import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = ['All Courses', 'WEB DEVELOPMENT', 'ARTIFICIAL INTELLIGENCE', 'DATA SCIENCE', 'PROGRAMMING LANGUAGES'];

  return (
    <div className='flex justify-center items-center'>
      <Tabs
        activeKey={activeCategory}
        onChange={onCategoryChange}
        centered
        className="mb-12"
        tabBarStyle={{
          borderBottom: '2px solid #8529ff',
          fontFamily: 'Playfair Display, serif',
          fontSize: '18px',
          color: '#8529ff'
        }}
      >
        {categories.map(category => (
          <TabPane 
            tab={
              <span className="px-4 py-2 text-indigo-900 hover:text-[#8529ff] transition-colors duration-300">
                {category}
              </span>
            } 
            key={category} 
          />
        ))}
      </Tabs>
    </div>
  )
}

export default CategoryFilter;
