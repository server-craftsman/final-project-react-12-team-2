import React, { useState, useEffect } from "react";
import { Typography, Divider, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Introduction from "../../components/generic/home/Introduction";
import Courses from "../../components/generic/courses/main-display/Courses";
import Categories from "../../components/generic/category/Categories";
import PageNumber from "../../components/generic/home/PageNumber";
import CategoryFilter from "../../components/generic/category/CategoryFilter";
// import { AuthProvider, useAuth } from "../../context/AuthContext";
import coursesData from "../../data/courses.json";
import usersData from "../../data/users.json";
import categoriesData from "../../data/categories.json";
import { Category } from "../../models/prototype/Category";
import InstructorSlider from "../../components/generic/home/InstructorSlider";
import UtilityProgram from "../../components/generic/home/UtilityProgram";
import UtilityRegisterInformation from "../../components/generic/home/UtilityRegisterInformation";
import { UserRole } from "../../models/prototype/User";
import { Course } from "../../models/prototype/Course";
const { Title } = Typography;

const HomePage: React.FC = () => {
  // const { role } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalCourses = coursesData.courses.length;
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [sliderCategories, setSliderCategories] = useState<Category[][]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex(
        (prevIndex) => (prevIndex + 1) % sliderCategories.length,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderCategories]);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories: Category[] = categoriesData.categories.map(
        (cat) => ({
          id: cat.id,
          user_id: cat.user_id,
          name: cat.name,
          description: cat.description,
          parent_category_id: cat.parent_category_id,
          created_at: cat.created_at,
          updated_at: cat.updated_at,
          is_deleted: cat.is_deleted,
        }),
      );

      // Divide categories into groups of 4
      const groupedCategories = [];
      for (let i = 0; i < fetchedCategories.length; i += 4) {
        groupedCategories.push(fetchedCategories.slice(i, i + 4));
      }
      setSliderCategories(groupedCategories);
    };

    fetchCategories();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 300);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const filteredCourses =
    activeCategory === "All Courses"
      ? coursesData.courses
      : coursesData.courses.filter(
          (course) =>
            course.category_id ===
            activeCategory.toLowerCase().replace(" & ", "_"),
        );

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container mx-auto bg-white">

      <motion.section
        className="bg-white px-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          level={2}
          className="mb-16 text-center font-serif text-6xl font-extrabold tracking-wide text-indigo-900"
        >
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-serif tracking-wide text-indigo-900"
          >
            Exquisite Learning Experiences
          </motion.span>
        </Title>
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <AnimatePresence>
          {isVisible && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Courses
                courses={paginatedCourses as unknown as Course[]}
                usersData={{
                  users: (usersData?.users || []).map((user) => ({
                    ...user,
                    role: user.role as UserRole,
                    dob: new Date(user.dob),
                  })),
                }}
                categoriesData={{
                  categories: categoriesData.categories.map((cat) => ({
                    ...cat,
                  })),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <div className="mt-12 flex justify-center">
        <PageNumber
          currentPage={currentPage}
          total={totalCourses}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>

      <Divider className="my-16 border-indigo-200" />
      <InstructorSlider />

      <Divider className="my-16 border-indigo-200" />
      <UtilityProgram />

      <Divider className="my-16 border-indigo-200" />
      <UtilityRegisterInformation />

      <Divider className="my-16 border-indigo-200" />

      <Introduction />
      <Divider className="my-16 border-indigo-200" />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-16 overflow-hidden"
      >
        <h1 className="mb-8 text-center text-2xl font-bold text-indigo-900">
          Top Categories
        </h1>
        <h1 className="mb-12 text-center text-4xl font-bold">
          Most demanding <span className="text-indigo-900">Categories</span>.
        </h1>
        <div
          className="mb-12 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentCategoryIndex * 100}%)` }}
        >
          {sliderCategories.map((categoryGroup, groupIndex) => (
            <div key={groupIndex} className="w-full flex-shrink-0">
              <Categories categories={categoryGroup} />
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-1/2 mt-4 flex -translate-x-1/2 transform space-x-2">
          {sliderCategories.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentCategoryIndex ? "w-4 bg-indigo-600" : "bg-indigo-200"}`}
              onClick={() => setCurrentCategoryIndex(index)}
            ></button>
          ))}
        </div>
      </motion.div>
      <motion.section
        className="mt-24 bg-white py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Title level={2} className="mb-8 text-5xl font-bold text-indigo-900">
            Elevate Your Expertise
          </Title>
          <Link to="/courses">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                size="large"
                className="hidden rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] px-4 py-2 text-sm font-medium text-indigo-900 shadow-md transition-all duration-200 ease-in-out hover:from-[#ffcc00] hover:to-[#ff9500] hover:shadow-lg lg:inline-block lg:px-6"
              >
                Explore All Premium Courses
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;
