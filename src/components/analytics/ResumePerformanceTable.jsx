import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ResumePerformanceTable({ resumes }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-8"
    >
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Resume Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{resume.title}</h3>
                  <p className="text-sm text-gray-500">{resume.template} template</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{resume.ats_score || 0}% ATS Score</p>
                    <Progress value={resume.ats_score || 0} className="w-24" />
                  </div>
                  <Badge variant={resume.ats_score >= 80 ? "default" : resume.ats_score >= 60 ? "secondary" : "destructive"}>
                    {resume.ats_score >= 80 ? "Excellent" : resume.ats_score >= 60 ? "Good" : "Needs Work"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}