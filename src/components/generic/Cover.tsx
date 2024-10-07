import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import courseMockup from '../../assets/cover/tablet-showing-website.jpg';
import mobileMockup from '../../assets/cover/phone-mobile-app.jpg';
import TextSlider from './TextSlider';

const Cover: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="bg-gradient-tone text-white min-h-screen flex items-center overflow-hidden w-full m-0 py-[120px]"
    >
      <div className="w-full px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between">
        {/* Left content */}
        <motion.div variants={itemVariants} className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent text-white"
          >
            Learn With Edu Learn
          </motion.h1>
          <div className="h-[1.5em] mb-6">
            <TextSlider />
          </div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
            Expand Your Knowledge
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl mb-8">
            Access thousands of high-quality courses from expert instructors.
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#ffd700] to-[#ffa500] hover:from-[#ffcc00] hover:to-[#ff9500] text-indigo-900 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Courses
          </motion.button>
          
          {/* Trust badges */}
          <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center lg:justify-start bg-opacity-20 bg-white backdrop-filter backdrop-blur-lg rounded-lg p-3"
            >
              <span className="text-[#ffd700] text-2xl mr-2">★★★★★</span>
              <span>50,000+ Satisfied Students</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center lg:justify-start bg-opacity-20 bg-white backdrop-filter backdrop-blur-lg rounded-lg p-3"
            >
              <span className="text-[#ffd700] text-2xl mr-2">🏆</span>
              <span>Top-Rated Instructors</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Right content - Course mockups */}
        <motion.div variants={itemVariants} className="lg:w-1/2 relative mt-12 lg:mt-0">
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Desktop course mockup */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="overflow-hidden rounded-lg shadow-2xl relative"
            >
              <img
                src={courseMockup}
                alt="Course on desktop"
                className="w-full h-auto transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-300 cursor-se-resize"></div>
            </motion.div>
            {/* Mobile app mockup */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute -bottom-7 -right-5 w-1/3 overflow-hidden"
            >
              <img
                src={mobileMockup}
                alt="Mobile app interface"
                className="shadow-xl w-full h-auto border-1 border-white rounded-3xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cover;
