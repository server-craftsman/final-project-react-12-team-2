import { useState, useEffect, useCallback } from "react";
import { GetPublicCourseParams } from "../../../../models/api/request/course/course.request.model";
import { GetPublicCategoryParams } from "../../../../models/api/request/admin/category.request.model";
import { CourseService } from "../../../../services/course/course.service";
import { GetCourseResponsePublic } from "../../../../models/api/responsive/course/course.response.model";
import { Card, Spin } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import FilteredAllCourses, { SortOption, CategoryOption } from './FilteredAllCourses';
import { CategoryService } from '../../../../services/category/category.service';


const AllCourses = () => {
    const [courses, setCourses] = useState<GetCourseResponsePublic[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchInput, setSearchInput] = useState<string>("");
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [selectedSort, setSelectedSort] = useState<SortOption>('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('');
    const pageSize = 12;

    // Add state for category params
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
                    // Kiểm tra nếu pageData là một mảng
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

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const params: GetPublicCourseParams = {
                pageInfo: {
                    pageNum: 1,
                    pageSize: pageSize,
                },
                searchCondition: {
                    keyword: searchQuery,
                    category_id: selectedCategory,
                    status: undefined,
                    is_delete: false,
                }
            };

            const response = await CourseService.getPublicCourse(params);
            if (response.data?.data) {
                let sortedCourses = [...response.data.data.pageData];
                
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
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedSort, selectedCategory]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        if (searchQuery === "") {
            fetchCourses();
        }
    }, [searchQuery, fetchCourses]);

    const handleSearch = () => {
        if (searchInput.trim() === "") {
            setSearchQuery("");
        } else {
            setSearchQuery(searchInput);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
            {/* Search Section */}
            <div className="flex justify-center mb-8">
                <div className="flex w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search by course..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-[#1a237e] rounded-l-full"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-gradient-tone px-4 ml-2 flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                        <SearchOutlined className="text-white text-xl" />
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <FilteredAllCourses
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                selectedSort={selectedSort}
                selectedCategory={selectedCategory}
                onReset={handleResetFilters}
            />

            {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <Link to={`/course/${course._id}`} key={course._id}>
                            <motion.div
                                className="h-full"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Card
                                    hoverable
                                    className="h-full"
                                    cover={
                                        <img
                                            alt={course.name}
                                            src={course.image_url}
                                            className="h-48 object-cover"
                                        />
                                    }
                                >
                                    <div className="space-y-2">
                                        {/* Course Info */}
                                        <div className="flex gap-4 text-sm text-gray-600">
                                            <span>{course.session_count} Session</span>
                                            <span>{course.lesson_count} Lessons</span>
                                            <span>{course.full_time} minutes</span>
                                        </div>

                                        {/* Course Title */}
                                        <h3 className="text-lg font-semibold">{course.name}</h3>

                                        {/* Category Tag */}
                                        <div className="inline-block bg-gradient-tone text-white px-2 py-1 rounded-md text-sm">
                                            {course.category_name}
                                        </div>

                                        {/* Instructor Name */}
                                        <p className="text-gray-600">{course.instructor_name}</p>

                                        {/* Price and Rating */}
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-green-600 font-semibold">
                                                {course.price_paid === 0 ? 'Free' : `${course.price_paid} đ`}
                                            </span>
                                            <button className="bg-gradient-tone text-white px-4 py-1 rounded-md hover:bg-gradient-tone-hover">
                                                Preview This Course
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && courses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No courses found
                </div>
            )}
        </div>
    );
};

export default AllCourses;


