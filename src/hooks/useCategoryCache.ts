import { useCallback, useRef } from "react";
import { CategoryService } from "../services/category/category.service";

const useCategoryCache = () => {
  // Use a ref to store the cache to avoid re-renders
  const categoryCache = useRef<Record<string, string>>({});

  const getCategoryName = useCallback(async (categoryId: string) => {
    if (categoryCache.current[categoryId]) {
      return categoryCache.current[categoryId];
    }

    try {
      const categoryResponse = await CategoryService.getCategory({
        searchCondition: {
          keyword: categoryId,
          is_parent: false,
          is_delete: false
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 1000
        }
      });
      const categoryName = categoryResponse?.data?.data?.pageData?.[0]?.name || "Unknown Category";
      categoryCache.current[categoryId] = categoryName;
      return categoryName;
    } catch (error) {
      return "Unknown Category";
    }
  }, []);

  return getCategoryName;
};

export default useCategoryCache;
