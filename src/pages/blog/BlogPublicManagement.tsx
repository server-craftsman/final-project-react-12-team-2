import { useEffect, useState } from "react";
import Blog from "../../components/generic/home/Blog";
import { motion, AnimatePresence } from "framer-motion";
const BlogPublicManagement = () => {
  const [isVisible, setIsVisible] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Blog searchQuery="" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogPublicManagement;
