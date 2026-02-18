import React from "react";
import { motion } from "framer-motion";

const features = [
  { title: "ATS Optimized", desc: "Pass applicant tracking systems", icon: "🎯" },
  { title: "Professional Design", desc: "Crafted by design experts", icon: "✨" },
  { title: "Easy Customization", desc: "Modify colors, fonts, and layout", icon: "🎨" },
  { title: "Multiple Formats", desc: "Export to PDF, DOCX, and more", icon: "📄" }
];

export default function FeatureList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">{feature.icon}</div>
          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}