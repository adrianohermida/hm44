import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export default function OtimizadorHeader({ otimizando, onClick, disabled }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div>
        <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" aria-hidden="true" />
          Otimização Inteligente
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Aprove cada sugestão individualmente
        </p>
      </div>
      <Button
        onClick={onClick}
        disabled={disabled || otimizando}
        className="bg-purple-600 hover:bg-purple-700"
        aria-label="Analisar e otimizar conteúdo"
      >
        {otimizando ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        )}
        <span className="ml-2 hidden sm:inline">Otimizar</span>
      </Button>
    </div>
  );
}