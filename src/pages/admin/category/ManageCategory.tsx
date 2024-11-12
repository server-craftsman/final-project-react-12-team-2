import { lazy, useState, useEffect } from "react";
import { Card, Layout } from "antd";
import { GetCategoryParams } from "../../../models/api/request/admin/category.request.model";
import { CategoryService } from "../../../services/category/category.service";
import { Category } from "../../../models/api/responsive/admin/category.responsive.model";

const AdminCategory = lazy(() => import("../../../components/admin/category/AdminCategory"));
const CustomSearch = lazy(() => import("../../../components/generic/search/CustomSearch"));
const CreateCategory = lazy(() => import("../../../components/admin/category/CreateCategory"));

const { Content } = Layout;

function ManageCategory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[] | null>(null);

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

  const handleSearch = (query: string) => {
    fetchCategoriesData();
    setSearchQuery(query);
  };

  if (categories === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <Content>
        <Card
          style={{
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <CustomSearch onSearch={handleSearch} placeholder="Search by name or description" className="search-input" />
            <CreateCategory />
          </div>
          <AdminCategory searchQuery={searchQuery} />
        </Card>
      </Content>
    );
  }
}

export default ManageCategory;
