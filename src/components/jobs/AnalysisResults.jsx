import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function AnalysisResults({ result }) {
  if (!result) {
    return (
      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Ready to Analyze</h3>
          <p className="text-gray-500 text-sm">Select a resume and paste a job description</p>
        </CardContent>
      </Card>
    );
  }

  const getMatchColor = (p) => p >= 80 ? "text-green-600" : p >= 60 ? "text-yellow-600" : "text-red-600";
  const getMatchBgColor = (p) => p >= 80 ? "bg-green-100" : p >= 60 ? "bg-yellow-100" : "bg-red-100";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className={`${getMatchBgColor(result.match_percentage)} border border-gray-200`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Match Score</span>
            <TrendingUp className={`w-5 h-5 ${getMatchColor(result.match_percentage)}`} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getMatchColor(result.match_percentage)} mb-2`}>
              {result.match_percentage}%
            </div>
            <Progress value={result.match_percentage} className="w-full mb-4" />
          </div>
        </CardContent>
      </Card>

      {result.strong_points?.length > 0 && (
        <Card className="bg-green-50 border border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" /> Strong Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strong_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}