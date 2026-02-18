import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Plus } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function TemplateCard({ template, onCreateResume }) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-200 relative overflow-hidden">
      {template.popular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">Popular</Badge>
        </div>
      )}
      
      <CardHeader className="pb-2 p-3 sm:p-4">
        <div className="h-40 sm:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 mb-3 sm:mb-4 relative">
          <div className="w-full h-full p-3 sm:p-4 rounded-md shadow-lg" style={{ backgroundColor: template.bgColor }}>
            <div className="text-center font-bold text-gray-700 text-xs sm:text-sm mb-2">{template.name}</div>
            <div className="w-1/2 h-0.5 sm:h-1 mx-auto rounded-full mb-2 sm:mb-3" style={{ backgroundColor: template.accent }} />
          </div>
        </div>
        
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{template.name}</CardTitle>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">{template.description}</p>
      </CardHeader>
      
      <CardContent className="pt-0 p-3 sm:p-4 flex flex-col h-full justify-end">
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6">
          {template.features.map((feature, i) => (
            <Badge key={i} variant="outline" className="text-xs" style={{ borderColor: template.accent, color: template.accent }}>
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link to={createPageUrl(`TemplatePreview?template=${template.id}`)} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Preview
            </Button>
          </Link>
          <Button size="sm" onClick={() => onCreateResume(template.id)} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}