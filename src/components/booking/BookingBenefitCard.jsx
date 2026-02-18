import React from "react";
import { motion } from "framer-motion";

export default function BookingBenefitCard({ benefit, index, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-4"
    >
      <div className="w-12 h-12 bg-[#0d9c6e]/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <benefit.icon className="w-6 h-6 text-[#0d9c6e]" />
      </div>
      <div>
        <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {benefit.title}
        </h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
}