import { Select } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | '';
export type CategoryOption = string;

interface FilteredAllCoursesProps {
  onSearch: (sort: SortOption, category: CategoryOption) => void;
  categories: { _id: string; name: string }[];
  selectedSort: SortOption;
  selectedCategory: CategoryOption;
}

const FilteredAllCourses: React.FC<FilteredAllCoursesProps> = ({
  onSearch,
  categories,
  selectedSort,
  selectedCategory,
}) => {
  const [tempSort, setTempSort] = useState<SortOption>(selectedSort);
  const [tempCategory, setTempCategory] = useState<CategoryOption>(selectedCategory);

  const handleSearch = () => {
    onSearch(tempSort, tempCategory);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      {/* Sort Options */}
      <div className="relative w-full md:w-48">
        <Select
          value={tempSort || ''}
          onChange={setTempSort}
          className="w-full"
          placeholder="All"
          allowClear={!!tempSort}
        >
          <Option value="">All</Option>
          <Option value="price_asc">
            <div className="flex items-center">
              <SortAscendingOutlined className="mr-2" />
              Price: Low to High
            </div>
          </Option>
          <Option value="price_desc">
            <div className="flex items-center">
              <SortDescendingOutlined className="mr-2" />
              Price: High to Low
            </div>
          </Option>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="relative w-full md:w-48">
        <Select
          value={tempCategory || ''}
          onChange={setTempCategory}
          className="w-full"
          placeholder="All Categories"
          allowClear={!!tempCategory}
        >
          <Option value="">All Categories</Option>
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* <Button
        type="primary"
        onClick={handleSearch}
        className="bg-gradient-tone text-white hover:opacity-90 flex items-center justify-center h-8 w-8"
        icon={<SearchOutlined className="text-lg" />}
      /> */}
      <button onClick={handleSearch} className="flex items-center gap-2 border border-gray-300 bg-white rounded-md text-black hover:opacity-90 justify-center h-8 w-24">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        Filters
      </button>
    </div>
  );
};

export default FilteredAllCourses;
