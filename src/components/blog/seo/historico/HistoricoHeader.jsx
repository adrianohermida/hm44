import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

export default function HistoricoHeader({ periodo, onPeriodoChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
      <div>
        <h4 className="font-bold text-xs sm:text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" aria-hidden="true" />
          Histórico de Posicionamento
        </h4>
        <p className="text-xs text-gray-600 mt-0.5">
          Evolução do score SEO
        </p>
      </div>
      <Select value={periodo} onValueChange={onPeriodoChange}>
        <SelectTrigger className="w-full sm:w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">7 dias</SelectItem>
          <SelectItem value="30d">30 dias</SelectItem>
          <SelectItem value="90d">90 dias</SelectItem>
          <SelectItem value="all">Tudo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}