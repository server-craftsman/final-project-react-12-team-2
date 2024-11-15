import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import TextSlider from "./TextSlider";
import Lottie from "lottie-react";
import tabletAnimation from "../../../data/tablet.json";
import mobileAnimation from "../../../data/mobileAnimation.json";

const Cover: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={containerVariants} className="bg-gradient-tone m-0 flex min-h-screen w-full items-center overflow-hidden py-[120px] text-white">
      <div className="relative z-10 flex w-full flex-col items-center justify-between px-6 lg:flex-row">
        {/* Left content */}
        <motion.div variants={itemVariants} className="mb-12 text-center lg:mb-0 lg:w-1/2 lg:text-left">
          <motion.h1 variants={itemVariants} className="mb-6 bg-clip-text text-4xl font-extrabold text-transparent text-white md:text-6xl">
            Learn With Edu Learn
          </motion.h1>
          <div className="mb-6 h-[1.5em]">
            <TextSlider />
          </div>
          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            Expand Your Knowledge
          </motion.h2>
          <motion.p variants={itemVariants} className="mb-8 text-xl">
            Access thousands of high-quality courses from expert instructors.
          </motion.p>
          <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] px-8 py-3 font-bold text-indigo-900 shadow-lg transition duration-300 hover:from-[#ffcc00] hover:to-[#ff9500] hover:shadow-xl">
            <Link to="/courses/all">
              Explore Courses
            </Link>
          </motion.button>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="mt-12 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0 lg:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center rounded-lg bg-white bg-opacity-20 p-3 backdrop-blur-lg backdrop-filter lg:justify-start">
              <span className="mr-2 text-2xl text-[#ffd700]">★★★★★</span>
              <span>50,000+ Satisfied Students</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center rounded-lg bg-white bg-opacity-20 p-3 backdrop-blur-lg backdrop-filter lg:justify-start">
              <span className="mr-2 text-2xl text-[#ffd700]">🏆</span>
              <span>Top-Rated Instructors</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right content - Course mockups */}
        <motion.div variants={itemVariants} className="relative mt-12 lg:mt-0 lg:w-1/2">
          <div className="relative mx-auto w-full max-w-2xl">
            {/* Desktop course mockup */}
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="relative overflow-hidden rounded-lg shadow-2xl">
              <Lottie animationData={tabletAnimation} loop={true} />
              <div className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize bg-gray-300"></div>
            </motion.div>
            {/* Mobile app mockup */}
            <motion.div
              animate={{
                y: [0, -20, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute -bottom-7 -right-5 w-1/3 overflow-hidden"
            >
              <Lottie animationData={mobileAnimation} loop={true} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cover;
