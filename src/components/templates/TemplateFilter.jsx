import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Palette, Star } from "lucide-react";

const categories = [
  { id: "all", label: "All Templates", icon: Sparkles },
  { id: "professional", label: "Professional", icon: Zap },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "tech", label: "Technology", icon: Star }
];

export default function TemplateFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'}
        >
          <category.icon className="w-4 h-4 mr-2" />
          {category.label}
        </Button>
      ))}
    </div>
  );
}