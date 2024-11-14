import React, { useState, useEffect } from "react";
import { Typography, Divider, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Introduction from "../../components/generic/home/Introduction";
import Courses from "../../components/generic/courses/main-display/Courses";
import Categories from "../../components/generic/category/Categories";
import PageNumber from "../../components/generic/home/PageNumber";
import { GetCategoryResponsePublic } from "../../models/api/responsive/admin/category.responsive.model";
import { CategoryService } from "../../services/category/category.service";

const { Title } = Typography;

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [isVisible, setIsVisible] = useState(false);
  const [categoryList, setCategoryList] = useState<GetCategoryResponsePublic[]>([]);
  const totalCourses = categoryList.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getPublicCategory({
          searchCondition: {
            keyword: "",
            is_parent: false,
            is_delete: false
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          }
        });
        const pageData = response.data.data.pageData;
        setCategoryList(pageData as unknown as GetCategoryResponsePublic[]);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="container mx-auto">
      <motion.section className="bg-white px-5" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Title level={2} className="flex flex-row items-center justify-between mb-16 text-center font-serif text-6xl font-extrabold tracking-wide text-indigo-900">
          <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="font-serif tracking-wide text-indigo-900 hover:text-indigo-700 transition-colors duration-300">
            Popular Courses for You
          </motion.span>
          <div className="flex justify-center">
            <Link to="/courses/all">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95, rotate: -2, backgroundColor: "#4c51bf" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button type="primary" size="large" className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-indigo-900 hover:shadow-xl">
                  View All Courses
                </Button>
              </motion.div>
            </Link>
          </div>
        </Title>

      
        <AnimatePresence>
          {isVisible && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="hidden">
              <Courses pageNum={currentPage} pageSize={pageSize} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <div className="mt-12 flex justify-center">
        <PageNumber currentPage={currentPage} total={totalCourses} pageSize={pageSize} onChange={handlePageChange} />
      </div>

      <Divider className="my-16 border-indigo-200" />

      <Introduction />
      <Divider className="my-16 border-indigo-200" />
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative mb-16 overflow-hidden">
        <h1 className="mb-8 text-center text-2xl font-bold text-indigo-900">Top Categories</h1>
        <h1 className="mb-12 text-center text-4xl font-bold">
          Most demanding <span className="text-indigo-900">Categories</span>.
        </h1>

        <Categories categoryList={categoryList} />
      </motion.div>
    </div>
  );
};

export default HomePage;
