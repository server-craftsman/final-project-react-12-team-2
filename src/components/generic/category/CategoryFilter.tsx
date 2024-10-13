import React from "react";
import { Tabs } from "antd";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const categories = [
    "All Courses",
    "WEB DEVELOPMENT",
    "ARTIFICIAL INTELLIGENCE",
    "DATA SCIENCE",
    "PROGRAMMING LANGUAGES",
  ];

  const items = categories.map((category) => ({
    key: category,
    label: (
      <span className="px-2 py-1 text-xs text-indigo-900 transition-colors duration-300 hover:text-[#8529ff] sm:px-4 sm:py-2 sm:text-sm md:text-base lg:text-lg">
        {category}
      </span>
    ),
  }));

  return (
    <div className="flex w-full items-center justify-center overflow-x-auto">
      <Tabs
        activeKey={activeCategory}
        onChange={onCategoryChange}
        items={items}
        centered
        className="mb-6 w-full sm:mb-8 md:mb-10 lg:mb-12"
        tabBarStyle={{
          borderBottom: "2px solid #8529ff",
          fontFamily: "Playfair Display, serif",
          fontSize: "14px",
          color: "#8529ff",
        }}
        tabBarGutter={8}
      />
    </div>
  );
};

export default CategoryFilter;
