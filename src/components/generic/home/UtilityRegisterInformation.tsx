import React from 'react'
import { motion } from 'framer-motion'

const UtilityRegisterInformation: React.FC = () => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-20 px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-5xl md:text-6xl font-extrabold mb-6 font-serif"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      >
        Get Started with <span className="text-[#9900ff] italic">Edu Learn</span>
      </motion.h1>
      <motion.p 
        className="text-2xl mb-10 font-light"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
      >
        Immerse yourself in knowledge, anytime, anywhere
      </motion.p>
      
      <motion.div 
        className="max-w-2xl mx-auto"
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
      >
        <form className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full py-4 px-10 rounded-full bg-opacity-20 bg-white text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 transition duration-300"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>
          <motion.button 
            type="submit" 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold py-4 px-8 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition duration-300 shadow-lg relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Subscribe!</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </form>
      </motion.div>
      
      <motion.div 
        className="flex flex-wrap justify-center mt-12 space-x-8 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Seamless Access
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          No Credit Card Required
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gold-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Join Our Community of 85,000+ Learners
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UtilityRegisterInformation