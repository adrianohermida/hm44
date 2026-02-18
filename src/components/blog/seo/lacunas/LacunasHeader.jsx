import React from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

export default function LacunasHeader({ analisando, disabled, onClick }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-bold text-xs sm:text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-orange-600" aria-hidden="true" />
          Lacunas de Conteúdo
        </h4>
        <p className="text-xs text-gray-600 mt-0.5">
          Oportunidades por nicho
        </p>
      </div>
      <Button
        size="sm"
        onClick={onClick}
        disabled={disabled || analisando}
        className="bg-orange-600 hover:bg-orange-700"
        aria-label="Analisar lacunas de conteúdo"
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