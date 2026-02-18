import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Target, Calendar, Award } from "lucide-react";

export default function KeyMetrics({ resumes, applications, avgScore, successRate }) {
  const metrics = [
    { icon: FileText, label: "Total Resumes", value: resumes.length, color: "green" },
    { icon: Target, label: "Avg ATS Score", value: `${avgScore}%`, color: "blue" },
    { icon: Calendar, label: "Applications", value: applications.length, color: "purple" },
    { icon: Award, label: "Success Rate", value: `${successRate}%`, color: "orange" }
  ];

  const colorMap = {
    green: { from: "from-green-50", to: "to-emerald-50", border: "border-green-200/50", text: "text-green-600" },
    blue: { from: "from-blue-50", to: "to-indigo-50", border: "border-blue-200/50", text: "text-blue-600" },
    purple: { from: "from-purple-50", to: "to-pink-50", border: "border-purple-200/50", text: "text-purple-600" },
    orange: { from: "from-orange-50", to: "to-red-50", border: "border-orange-200/50", text: "text-orange-600" }
  };

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.1 }}>
          <Card className={`bg-gradient-to-r ${colorMap[metric.color].from} ${colorMap[metric.color].to} ${colorMap[metric.color].border}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${colorMap[metric.color].text} text-sm font-medium`}>{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <metric.icon className={`w-8 h-8 ${colorMap[metric.color].text}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}