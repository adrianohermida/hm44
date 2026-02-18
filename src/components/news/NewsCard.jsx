import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const categoryColors = {
  "Hiring Trends": "bg-blue-100 text-blue-800",
  "Salary Insights": "bg-green-100 text-green-800",
  "Remote Work": "bg-purple-100 text-purple-800",
  "AI Impact": "bg-orange-100 text-orange-800",
  "Skill Development": "bg-indigo-100 text-indigo-800",
  "Industry News": "bg-gray-100 text-gray-800"
};

export default function NewsCard({ article, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-200 group flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <Badge className={categoryColors[article.category] || categoryColors["Industry News"]}>
              {article.category}
            </Badge>
            <span className="text-xs text-gray-500">{article.source}</span>
          </div>
          <CardTitle className="text-lg leading-tight group-hover:text-green-600 transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 flex-grow flex flex-col">
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{article.summary}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(article.published_date), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.read_time} min read
            </div>
          </div>
          
          <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-green-50 group-hover:border-green-200">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" /> Read Full Article
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}