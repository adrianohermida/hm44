import React from "react";
import { Badge } from "@/components/ui/badge";

export default function TemaKeywords({ keywords }) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {keywords.slice(0, 5).map((kw, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          {kw}
        </Badge>
      ))}
    </div>
  );
}