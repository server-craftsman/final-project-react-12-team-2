// import { Category } from "../../models/Category"
// import categoriesData from "../../data/categories.json"
import PageNumber from "../generic/PageNumber"
import { Typography } from "antd"
const { Title } = Typography;

const Categories = () => {
    // const categories: Category[] = categoriesData.categories;
    return (
    <div>
        
        <div className="flex justify-center items-center">  
            <Title level={2}>Categories</Title>
            <div className="flex justify-center items-center ml-4">
                {/* <PageNumber currentPage={1} total={categories.length} pageSize={6} onChange={() => {}} /> */}
            </div>
        </div>
     
    </div>
  )
}

export default Categories
