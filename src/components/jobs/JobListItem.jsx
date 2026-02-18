import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar, DollarSign, TrendingUp, Send, Bookmark, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function JobListItem({ job, index, onApply, getTypeColor, getExperienceLevelColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              {job.company_logo && (
                <img src={job.company_logo} alt={`${job.company} logo`} className="w-12 h-12 rounded-lg object-contain border" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 truncate">{job.title}</h2>
                  {job.is_trending && (
                    <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white">
                      <TrendingUp className="w-3 h-3 mr-1" /> Trending
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1"><Briefcase className="w-4 h-4" /><span className="font-medium">{job.company}</span></div>
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{format(new Date(job.posted_date), 'MMM d, yyyy')}</span></div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">{job.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Button onClick={() => onApply(job)} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <Send className="w-4 h-4 mr-2" /> Quick Apply
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={createPageUrl(`JobDetails?id=${job.id}`)}>
                  <ExternalLink className="w-4 h-4 mr-2" /> View Details
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}