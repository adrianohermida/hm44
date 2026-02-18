import React from "react";
import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";

export default function TemplateGallery({ templates, onCreateResume }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <TemplateCard template={template} onCreateResume={onCreateResume} />
        </motion.div>
      ))}
    </div>
  );
}