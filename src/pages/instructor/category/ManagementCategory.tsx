import { useEffect, useState } from "react";
import CustomSearch from "../../../components/generic/search/CustomSearch";
import ViewCategory from "../../../components/instructor/category/ViewCategory";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";
import { GetCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { CategoryService } from "../../../services/category/category.service";

const ManagementCategory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async (params: GetCategoryParams) => {
    try {
      const response = await CategoryService.getCategory(params);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  };

    const fetchCategoriesData = async () => {
      try {
        const searchCondition = {
          keyword: searchQuery,
          is_parent: false,
          is_delete: false
        };

        const response = await fetchCategories({
          searchCondition,
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });

        if (response && response.success) {
          setCategories(response.data.pageData);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    useEffect(() => {
    fetchCategoriesData();
  }, [searchQuery]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    fetchCategoriesData();
  };
  
  if(categories) {
  return (
    <div>
      <CustomSearch onSearch={handleSearch} placeholder="Search Category Name" className="search-input" />
      <ViewCategory searchQuery={searchQuery} />
    </div>
  )
}
}
export default ManagementCategory;
