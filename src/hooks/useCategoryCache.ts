import { useCallback, useRef } from "react";
import { CategoryService } from "../services/category/category.service";

const useCategoryCache = () => {
  // Use a ref to store both the cache and pending promises
  const categoryCache = useRef<Record<string, string>>({});
  const pendingPromises = useRef<Record<string, Promise<string>>>({});

  const getCategoryName = useCallback(async (categoryId: string) => {
    // Return cached result if available
    if (categoryCache.current[categoryId]) {
      return categoryCache.current[categoryId];
    }

    // Return existing promise if request is already in flight
    if (categoryId in pendingPromises.current) {
      return pendingPromises.current[categoryId];
    }

    // Create new promise for this request
    const promise = (async () => {
      try {
        const categoryResponse = await CategoryService.getCategory({
          searchCondition: {
            keyword: categoryId,
            is_parent: false,
            is_delete: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 1 // Optimize by only requesting 1 result
          }
        });
        const categoryName = categoryResponse?.data?.data?.pageData?.[0]?.name || "Unknown Category";
        categoryCache.current[categoryId] = categoryName;
        return categoryName;
      } catch (error) {
        const fallback = "Unknown Category";
        categoryCache.current[categoryId] = fallback; // Cache errors too
        return fallback;
      } finally {
        delete pendingPromises.current[categoryId]; // Cleanup
      }
    })();

    pendingPromises.current[categoryId] = promise;
    return promise;
  }, []);

  return getCategoryName;
};

export default useCategoryCache;
