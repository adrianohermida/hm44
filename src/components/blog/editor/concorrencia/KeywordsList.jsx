import React from "react";
import { Badge } from "@/components/ui/badge";

export default function KeywordsList({ keywords }) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {keywords.slice(0, 3).map((kw, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          {kw}
        </Badge>
      ))}
    </div>
  );
}