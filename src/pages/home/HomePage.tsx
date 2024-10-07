import React, { useState, useContext, useEffect } from 'react';
import { Typography, Divider, Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Introduction from '../../components/student/Introduction';
import Courses from '../../components/student/Courses';
import Categories from '../../components/student/Categories';
import PageNumber from '../../components/generic/PageNumber';
import CategoryFilter from '../../components/generic/CategoryFilter';
import { AuthContext } from '../../context/AuthContext';
import coursesData from '../../data/courses.json';
import usersData from '../../data/users.json';

const { Title } = Typography;

const HomePage: React.FC = () => {
  const { user: _user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalCourses = coursesData.courses.length;
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Courses');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 300);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const filteredCourses = activeCategory === 'All Courses'
    ? coursesData.courses
    : coursesData.courses.filter(course => course.category_id === activeCategory.toLowerCase().replace(' & ', '_'));

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-indigo-50 to-white">
      <Introduction />
      <Divider className="my-16 border-indigo-200" />
      <Categories />
      <Divider className="my-16 border-indigo-200" />
      
      <motion.section 
        className="bg-gradient-to-b from-indigo-50 to-white py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} className="text-6xl font-extrabold text-indigo-900 mb-16 text-center font-serif tracking-wide">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-indigo-900 font-serif tracking-wide"
          >
            Exquisite Learning Experiences
          </motion.span>
        </Title>
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

        <AnimatePresence>
          {isVisible && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Courses courses={paginatedCourses} usersData={usersData} />
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

      <motion.section 
        className="mt-24 text-center bg-gradient-to-b from-indigo-50 to-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Title level={2} className="text-5xl font-bold text-indigo-900 mb-8">
            Elevate Your Expertise
          </Title>
          <Link to="/courses">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" size="large" className="bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffcc00] hover:to-[#ff9500] text-indigo-900 font-medium py-2 px-4 lg:px-6 rounded-full text-sm transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hidden lg:inline-block">
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