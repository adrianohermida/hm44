import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2, Sparkles } from "lucide-react";

export default function AutoridadeHeader({ analisando, disabled, onClick }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-bold text-xs sm:text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" aria-hidden="true" />
          Métricas de Autoridade
        </h4>
        <p className="text-xs text-gray-600 mt-0.5">
          Tráfego, dificuldade e ranking
        </p>
      </div>
      <Button
        size="sm"
        onClick={onClick}
        disabled={disabled || analisando}
        className="bg-purple-600 hover:bg-purple-700"
        aria-label="Analisar métricas de autoridade"
      >
        {analisando ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}