import React from "react";
import { TrendingUp } from "lucide-react";

export default function SEOScoreHeader({ score }) {
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-bold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        SEO
      </h3>
      <span className={`text-2xl font-bold ${scoreColor}`}>
        {score}/100
      </span>
    </div>
  );
}