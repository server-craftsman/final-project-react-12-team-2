import { Card, Carousel } from "antd";
import { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Categories = ({ categoryList }: { categoryList: any[] }) => {
  const [categoryListState, setCategoryListState] = useState<any[]>([]);

  useEffect(() => {
    if (categoryList.length > 0) {
      setCategoryListState(categoryList);
    }
  }, [categoryList]);

  const SamplePrevArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <LeftOutlined className="text-2xl text-indigo-600 hover:text-indigo-800" />
      </div>
    );
  };

  const SampleNextArrow = (props: any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <RightOutlined className="text-2xl text-indigo-600 hover:text-indigo-800" />
      </div>
    );
  };

  return (
    <Carousel 
      autoplay 
      className="p-8"
      arrows
      prevArrow={<SamplePrevArrow />}
      nextArrow={<SampleNextArrow />}
    >
      {categoryListState.map((category, index) => (
        <Card
          key={category._id || index}
          title={
            <span className="text-2xl font-serif font-bold text-indigo-900">
              {category.name || "Unnamed Category"}
            </span>
          }
          className="mx-4 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #f6f8ff 0%, #ffffff 100%)",
            borderBottom: "4px solid #818cf8",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
          }}
          headStyle={{
            borderBottom: "2px solid #e2e8f0",
            padding: "20px"
          }}
          bodyStyle={{
            padding: "24px",
            minHeight: "200px"
          }}
        >
          <div 
            className="prose prose-indigo max-w-none text-gray-700 font-light text-lg"
            dangerouslySetInnerHTML={{ 
              __html: category.description || "No description available" 
            }} 
          />
        </Card>
      ))}
    </Carousel>
  );
};

export default Categories;
