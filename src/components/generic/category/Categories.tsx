import { Card } from "antd";
import { GetCategoryResponsePublic } from "../../../models/api/responsive/admin/category.responsive.model";    
import { useEffect, useState } from "react";

const Categories = ({ categoryList }: { categoryList: GetCategoryResponsePublic[] }) => {
  const [categoryListState, setCategoryListState] = useState<GetCategoryResponsePublic[]>([]);

  useEffect(() => {
    if (categoryList.length > 0) {
      setCategoryListState(categoryList);
    }
  }, [categoryList]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {categoryListState.map((category, index) => (
        <Card 
          key={category.pageData?._id || index}
          title={category.pageData?.name}
          className="hover:shadow-lg transition-shadow duration-300"
          style={{ 
            backgroundColor: '#f0f2f5',
            borderBottom: '1px solid #e8e8e8',
            color: '#000000'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: category.pageData?.description || '' }} />
        </Card>
      ))}
    </div>
  );
};

export default Categories;
