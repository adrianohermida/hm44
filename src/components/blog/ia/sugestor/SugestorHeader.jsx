import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SugestorHeader({ carregando, disabled, onClick, categoria }) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" aria-hidden="true" />
            Sugestão de Temas
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Baseado em volume de busca e IA
          </p>
        </div>
        <Button
          onClick={onClick}
          disabled={disabled || carregando}
          className="bg-purple-600 hover:bg-purple-700"
          aria-label="Gerar sugestões de temas"
        >
          {carregando ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          )}
          <span className="ml-2 hidden sm:inline">Gerar</span>
        </Button>
      </div>
      {categoria && (
        <Badge variant="outline" className="text-xs">
          📂 {categoria}
        </Badge>
      )}
    </div>
  );
}