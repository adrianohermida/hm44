import React from "react";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PlanoBadgeLei() {
  return (
    <Badge 
      variant="outline" 
      className="border-orange-500 text-orange-600 dark:text-orange-400 gap-1"
    >
      <Shield className="w-3 h-3" />
      LEI 14.181/2021
    </Badge>
  );
}