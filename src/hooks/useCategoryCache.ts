import { CategoryService } from "../services/category/category.service";

const useCategoryCache = () => {
  // Use plain objects to store both the cache and pending promises
  const categoryCache: Record<string, string> = {};
  const pendingPromises: Record<string, Promise<string>> = {};

  const getCategoryName = async (categoryId: string) => {
    // Return cached result if available
    if (categoryCache[categoryId]) {
      return categoryCache[categoryId];
    }

    // Return existing promise if request is already in flight
    if (categoryId in pendingPromises) {
      return pendingPromises[categoryId];
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
        categoryCache[categoryId] = categoryName;
        return categoryName;
      } catch (error) {
        const fallback = "Unknown Category";
        categoryCache[categoryId] = fallback; // Cache errors too
        return fallback;
      } finally {
        delete pendingPromises[categoryId]; // Cleanup
      }
    })();

    pendingPromises[categoryId] = promise;
    return promise;
  };

  return getCategoryName;
};

export default useCategoryCache;
