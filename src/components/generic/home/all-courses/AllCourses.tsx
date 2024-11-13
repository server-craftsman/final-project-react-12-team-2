import { useState, useEffect, useCallback } from "react";
import { GetPublicCourseParams } from "../../../../models/api/request/course/course.request.model";
import { GetPublicCategoryParams } from "../../../../models/api/request/admin/category.request.model";
import { CourseService } from "../../../../services/course/course.service";
import { GetCourseResponsePublic } from "../../../../models/api/responsive/course/course.response.model";
import { Card, Typography , Button,  Tag } from "antd";
import { helpers } from "../../../../utils";
import {  BookOutlined, VideoCameraOutlined, PercentageOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import FilteredAllCourses, { SortOption, CategoryOption } from './FilteredAllCourses';
import { CategoryService } from '../../../../services/category/category.service';
import parse from "html-react-parser";
import { UserService } from "../../../../services/student/user.service";
import { useCart } from "../../../../contexts/CartContext";
import { Link } from "react-router-dom";
import Pagination from "antd/es/pagination";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const AllCourses = () => {
    const [courses, setCourses] = useState<GetCourseResponsePublic[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [selectedSort, setSelectedSort] = useState<SortOption>('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('');
    const [pageSize ] = useState<number>(6);
    const { isCoursePurchased } = useCart();
    const [, setUsers] = useState<{ [key: string]: any }>({});
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);

    const [categoryParams,] = useState<GetPublicCategoryParams>({
        searchCondition: {
            keyword: "",
            is_parent: false,
            is_delete: false
        },
        pageInfo: {
            pageNum: 1,
            pageSize: 100 
        }
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getPublicCategory(categoryParams);
                if (response.data?.data?.pageData) {
                    const categoriesData = Array.isArray(response.data.data.pageData) 
                        ? response.data.data.pageData 
                        : [response.data.data.pageData];
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Add this effect to fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userPromises = courses.map(async (course) => {
                    const userData = await UserService.getUserDetails(course.instructor_id);
                    return { courseId: course._id, user: userData.data.data };
                });
                const usersData = await Promise.all(userPromises);
                const usersMap = usersData.reduce((acc: { [key: string]: any }, { courseId, user }) => {
                    acc[courseId] = user;
                    return acc;
                }, {});
                setUsers(usersMap);
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }
        };
        if (courses.length > 0) {
            fetchUserDetails();
        }
    }, [courses]);

    const fetchCourses = useCallback(async () => {
        try {
            const params: GetPublicCourseParams = {
                pageInfo: {
                    pageNum: pageNum,
                    pageSize: pageSize,
                },
                searchCondition: {
                    keyword: "",
                    category_id: selectedCategory,
                    status: undefined,
                    is_delete: false,
                }
            };
            const response = await CourseService.getPublicCourse(params);
            if (response.data?.data) {
                let sortedCourses = [...response.data.data.pageData];
                setTotalItems(response.data.data.pageInfo.totalItems || 0);
                
                // Apply sorting
                switch (selectedSort) {
                    case 'price_asc':
                        sortedCourses.sort((a, b) => a.price_paid - b.price_paid);
                        break;
                    case 'price_desc':
                        sortedCourses.sort((a, b) => b.price_paid - a.price_paid);
                        break;
                    case 'name_asc':
                        sortedCourses.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    case 'name_desc':
                        sortedCourses.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                }                
                setCourses(sortedCourses);
            }
        } catch (err) {
            setError("Failed to fetch courses");
            console.error(err);
        }
    }, [selectedSort, selectedCategory, pageNum, pageSize]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSortChange = (value: SortOption) => {
        setSelectedSort(value);
    };

    const handleCategoryChange = (value: CategoryOption) => {
        setSelectedCategory(value);
    };

    const handleResetFilters = () => {
        setSelectedSort('');
        setSelectedCategory('');
    };

    return (
        <div className="p-6">
            <FilteredAllCourses
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                selectedSort={selectedSort}
                selectedCategory={selectedCategory}
                onReset={handleResetFilters}
            />
            <div className="text-red-500 text-center">{error}</div>            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                    const { purchased, isInCart } = isCoursePurchased(course._id);
                    // const user = users[course._id]; 
                    return (
                        <motion.div
                            key={course._id}
                            className="h-full"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Card
                                hoverable
                                cover={<img alt={course.name} src={course.image_url} className="h-48 w-full object-cover" />}
                                className={`group relative flex h-[600px] flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${purchased ? "border-green-500" : ""} ${isInCart ? "border-blue-500" : ""}`}
                            >
                                {purchased && <div className="absolute right-0 top-0 rounded-bl-lg bg-green-500 px-3 py-1 text-white">Purchased</div>}
                                {course.discount > 0 && (
                                    <motion.div className="bg-gradient-tone absolute left-0 top-0 rounded-br-lg px-3 py-1 text-white" whileHover={{ scale: 1.05 }}>
                                        <PercentageOutlined className="mr-1" />
                                        {course.discount}% OFF
                                    </motion.div>
                                )}
                                <div className="flex h-[400px] flex-col">
                                    <Title level={3} className="mb-2 line-clamp-2 h-16 text-xl font-bold text-[#1a237e] transition duration-300 hover:text-indigo-900">
                                        {course.name}
                                    </Title>
                                    <Paragraph className="mb-4 line-clamp-2 h-12 text-gray-600" ellipsis={{ rows: 2 }}>
                                        {parse(course.description)}
                                    </Paragraph>
                                    <div className="h-20">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-2xl font-bold text-indigo-800">${helpers.moneyFormat(course.price_paid * (1 - course.discount / 100))}</span>
                                            {course.discount > 0 && <span className="text-lg text-gray-500 line-through">${helpers.moneyFormat(course.price_paid)}</span>}
                                        </div>
                                    </div>
                                    <Meta
                                        // avatar={<Avatar src={user?.avatar_url} />}
                                        title={<span className="line-clamp-1 text-lg font-semibold text-gray-800">{course.instructor_name}</span>}
                                        description={
                                            <div className="mb-4 h-24 items-center text-sm">
                                                <div>
                                                    <Tag className="bg-gradient-tone mr-2 rounded px-2 py-1 text-xs font-semibold uppercase text-white">{course.category_name}</Tag>
                                                </div>
                                                <div className="mt-4 flex items-center space-x-4">
                                                    <span className="flex items-center font-medium text-gray-600">
                                                        <BookOutlined className="mr-2 text-indigo-500" />
                                                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.session_count} Sessions</span>
                                                    </span>
                                                    <span className="flex items-center font-medium text-gray-600">
                                                        <VideoCameraOutlined className="mr-2 text-indigo-500" />
                                                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{course.lesson_count} Lessons</span>
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                        className="mb-4"
                                    />
                                </div>
                                <motion.div className="absolute inset-x-0 bottom-0 h-12 translate-y-full transform transition-all duration-300 group-hover:translate-y-0" whileHover={{ scale: 1.05 }}>
                                    <Link to={`/course/${course._id}`}>
                                        <Button type="primary" block size="large" className="bg-gradient-tone hover:bg-gradient-tone-hover border-none">
                                            Preview This Course
                                        </Button>
                                    </Link>
                                </motion.div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
            {courses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No courses found
                </div>
            )}
            <div className="mt-5 flex justify-start">
                <Pagination
                    current={pageNum}
                    pageSize={6}
                    total={totalItems}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={(page) => {
                        setPageNum(page);
                        //setPageSize(size);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showSizeChanger
                    className="bg-pagination"
                />
            </div>
        </div>
        
    );
};

export default AllCourses;


