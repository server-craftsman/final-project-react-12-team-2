import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  "Anytime",
  "Anywhere",
  "At Your Pace",
  "Flexible Learning",
  "Self-Paced",
  "On-Demand",
  "Convenient",
  "Accessible",
  "Personalized",
  "Adaptable"
];

const TextSlider: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: 1, 
          x: 0,
        }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut",
        }}
        className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-3xl md:text-4xl font-bold"
      >
        {phrases[index]}
      </motion.span>
    </AnimatePresence>
  );
};

export default TextSlider;