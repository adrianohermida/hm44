import React from "react";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FaturasSecureBadge() {
  return (
    <Badge 
      variant="outline" 
      className="border-[var(--brand-primary)] text-[var(--brand-primary)] gap-1"
    >
      <Shield className="w-3 h-3" />
      PAGAMENTO SEGURO
    </Badge>
  );
}