import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function LivePreview({ template, sampleData }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-2"
    >
      <Card className="shadow-2xl">
        <CardContent className="p-0">
          <div className="min-h-[800px] p-8 font-serif text-sm" style={{ backgroundColor: template.bgColor }}>
            <div className="text-center border-b-2 pb-4 mb-6" style={{ borderColor: template.accent }}>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{sampleData.personal_info.full_name}</h1>
              <div className="text-gray-600 space-y-1">
                <p>{sampleData.personal_info.email} | {sampleData.personal_info.phone}</p>
                <p>{sampleData.personal_info.location}</p>
              </div>
            </div>

            <section className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: template.accent }}>PROFESSIONAL SUMMARY</h2>
              <p className="text-gray-700 leading-relaxed">{sampleData.personal_info.summary}</p>
            </section>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}