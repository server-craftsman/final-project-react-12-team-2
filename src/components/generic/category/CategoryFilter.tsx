// import React, { useEffect, useState } from "react";
// import { Select } from "antd";
// import { CategoryService } from "../../../services/category/category.service";
// import { GetCategoryResponse } from "../../../models/api/responsive/admin/category.responsive.model";

// interface CategoryFilterProps {
//   activeCategory: string;
//   onCategoryChange: (value: string) => void;
// }

// const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
//   const [categories, setCategories] = useState<GetCategoryResponse[]>([]);

//   useEffect(() => {
//     CategoryService.getPublicCategory({
//       searchCondition: {
//         keyword: "",
//         is_parent: false,
//         is_delete: false
//       },
//       pageInfo: {
//         pageNum: 1,
//         pageSize: 10,
//       }
//     }).then((res) => {
//       setCategories(res.data.data.pageData[0]);
//     });
//   }, []);

//   // const items = categories.map((category) => ({
//   //   key: category.data.pageData[0].name,
//   //   label: <span className="px-2 py-1 text-xs text-indigo-900 transition-colors duration-300 hover:text-[#8529ff] sm:px-4 sm:py-2 sm:text-sm md:text-base lg:text-lg">{category}</span>
//   // }));

//   return (
//     <div className="flex w-full items-center justify-center">
//       <Select
//         defaultValue="All Courses"
//         value={activeCategory}
//         onChange={onCategoryChange}
//         className="mb-6 w-full max-w-md sm:mb-8 md:mb-10 lg:mb-12"
//         style={{
//           fontFamily: "Playfair Display, serif",
//           fontSize: "14px",
//           color: "#8529ff"
//         }}
//       >
//         <Select.Option value="All Courses">
//           <span className="text-indigo-900">All Courses</span>
//         </Select.Option>
//         {categories.map((category) => (
//           <Select.Option key={category.pageData[0]._id} value={category.pageData[0].name}>
//             <span className="text-indigo-900">{category.pageData[0].name}</span>
//           </Select.Option>
//         ))}
//       </Select>
//     </div>
//   );
// };

// export default CategoryFilter;
