import React from "react";
import { motion } from "framer-motion";
import utilBanner1 from "../../../assets/cover/banner-2-thumb-1.png";
import utilBanner2 from "../../../assets/cover/banner-2-thumb-2.png";

const UtilityProgram: React.FC = () => {
  return (
    <div className="flex space-x-4">
      {/* Earn a Certificate Card */}
      <motion.div className="w-1/2 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 shadow-md" whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
        <h2 className="mb-3 text-2xl font-bold text-emerald-800">
          Earn a <span className="text-emerald-600">Certificate</span>
        </h2>
        <motion.button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-white hover:text-emerald-600" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          View Programs
        </motion.button>
        <motion.div className="mt-4" whileHover={{ scale: 1.02 }}>
          <img src={utilBanner1} alt="Certificate illustration" className="h-40 w-full rounded-md object-cover shadow-sm" />
        </motion.div>
      </motion.div>

      {/* Best Rated Courses Card */}
      <motion.div className="w-1/2 rounded-lg bg-gradient-to-br from-rose-50 to-rose-100 p-6 shadow-md" whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
        <h2 className="mb-3 text-2xl font-bold text-rose-800">
          Best <span className="text-rose-600">Rated Courses</span>
        </h2>
        <motion.button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-white hover:text-rose-500" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          View Programs
        </motion.button>
        <motion.div className="mt-4" whileHover={{ scale: 1.02 }}>
          <img src={utilBanner2} alt="Online course illustration" className="h-40 w-full rounded-md object-cover shadow-sm" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UtilityProgram;
