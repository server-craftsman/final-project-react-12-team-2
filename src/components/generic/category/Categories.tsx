import { Card } from "antd";
import { Category } from "../../../models/prototype/Category";

const Categories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Card key={category.id} className="rounded-lg shadow-md">
            <div className="mb-4 flex items-center">
              {/* Replace with actual icon component or image */}
              <div className="mr-4 h-12 w-12 rounded-full bg-blue-100"></div>
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-500">{category.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
