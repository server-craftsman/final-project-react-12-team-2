import React from "react";
import { motion } from "framer-motion";

const UtilityRegisterInformation: React.FC = () => {
  return (
    <motion.div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 px-8 py-20 text-center text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.h1 className="mb-6 font-serif text-5xl font-extrabold md:text-6xl" initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 120 }}>
        Get Started with <span className="italic text-[#9900ff]">Edu Learn</span>
      </motion.h1>
      <motion.p className="mb-10 text-2xl font-light" initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 120 }}>
        Immerse yourself in knowledge, anytime, anywhere
      </motion.p>

      <motion.div className="mx-auto max-w-2xl" animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 120 }}>
        <form className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-grow">
            <input type="email" placeholder="Enter your email address" className="focus:ring-gold-500 w-full rounded-full bg-white bg-opacity-20 px-10 py-4 text-white placeholder-gray-300 transition duration-300 focus:outline-none focus:ring-2" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-gold-500 h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
          <motion.button type="submit" className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:from-yellow-500 hover:to-yellow-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="relative z-10">Subscribe!</span>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />
          </motion.button>
        </form>
      </motion.div>

      <motion.div className="mt-12 flex flex-wrap justify-center space-x-8 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
        <div className="mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-gold-500 mr-3 h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Seamless Access
        </div>
        <div className="mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-gold-500 mr-3 h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No Credit Card Required
        </div>
        <div className="mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-gold-500 mr-3 h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Join Our Community of 85,000+ Learners
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UtilityRegisterInformation;
