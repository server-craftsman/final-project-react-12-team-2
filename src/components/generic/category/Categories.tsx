import { Card } from "antd";
import { Category } from "../../../models/Category";

const Categories = ({ categories }: { categories: Category[] }) => {
    return (
        <div className="container mx-auto px-4"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <Card key={category.id} className="shadow-md rounded-lg">
                        <div className="flex items-center mb-4">
                            {/* Replace with actual icon component or image */}
                            <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
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
