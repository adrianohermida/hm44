import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Star } from "lucide-react";

const filters = [
  { id: "all", label: "Todos", icon: Star },
  { id: "recent", label: "Recentes", icon: Clock },
  { id: "popular", label: "Populares", icon: TrendingUp },
];

export default function VideoGalleryFilters({ filter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {filters.map((f) => (
        <Button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          variant={filter === f.id ? "default" : "outline"}
          className={filter === f.id ? "bg-[var(--brand-primary)]" : ""}
        >
          <f.icon className="w-4 h-4 mr-2" />
          {f.label}
        </Button>
      ))}
    </div>
  );
}