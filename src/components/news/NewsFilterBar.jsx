import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, TrendingUp, Users, Clock } from "lucide-react";

const categories = [
  { id: "all", label: "All News", icon: Bell },
  { id: "Hiring Trends", label: "Hiring", icon: TrendingUp },
  { id: "Salary Insights", label: "Salaries", icon: Users },
  { id: "Remote Work", label: "Remote", icon: Clock },
  { id: "AI Impact", label: "AI Impact", icon: TrendingUp }
];

export default function NewsFilterBar({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, onRefresh }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search career news and trends..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onRefresh} variant="outline" className="border-green-200 hover:bg-green-50">
          Refresh News
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={selectedCategory === category.id ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50'}
          >
            <category.icon className="w-4 h-4 mr-2" />
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
}