import { Select, Button } from 'antd';
import { SortAscendingOutlined, SortDescendingOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | '';
export type CategoryOption = string;

interface FilteredAllCoursesProps {
  onSortChange: (value: SortOption) => void;
  onCategoryChange: (value: CategoryOption) => void;
  categories: { _id: string; name: string }[];
  selectedSort: SortOption;
  selectedCategory: CategoryOption;
  onReset: () => void;
}

const FilteredAllCourses: React.FC<FilteredAllCoursesProps> = ({
  onSortChange,
  onCategoryChange,
  categories,
  selectedSort,
  selectedCategory,
  onReset,
}) => {
  // Check if there are any active filters
  const hasActiveFilters = selectedSort !== '' || selectedCategory !== '';

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      {/* Sort Options */}
      <div className="relative w-full md:w-48">
        <Select
          value={selectedSort}
          onChange={onSortChange}
          className="w-full"
          placeholder="All"
          allowClear={selectedSort !== ''}
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
          <Option value="name_asc">
            <div className="flex items-center">
              <SortAscendingOutlined className="mr-2" />
              Name: A to Z
            </div>
          </Option>
          <Option value="name_desc">
            <div className="flex items-center">
              <SortDescendingOutlined className="mr-2" />
              Name: Z to A
            </div>
          </Option>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="relative w-full md:w-48">
        <Select
          value={selectedCategory}
          onChange={onCategoryChange}
          className="w-full"
          placeholder="All Categories"
          allowClear={selectedCategory !== ''}
        >
          <Option value="">All Categories</Option>
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Reset All Filters Button */}
      {hasActiveFilters && (
        <Button
          icon={<CloseCircleOutlined />}
          onClick={onReset}
          className="flex items-center bg-gradient-tone text-white hover:opacity-90"
        >
          Reset All Filters
        </Button>
      )}
    </div>
  );
};

export default FilteredAllCourses;
