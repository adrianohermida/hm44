import React from "react";
import { Button } from "@/components/ui/button";
import { Target, Loader2, RefreshCw } from "lucide-react";

export default function ScoreHeader({ calculando, onCalcular }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-bold text-sm flex items-center gap-2">
          <Target className="w-4 h-4 text-green-600" />
          Score SEO Detalhado
        </h4>
        <p className="text-xs text-gray-600 mt-0.5">
          Pontuação detalhada 0-100
        </p>
      </div>
      <Button 
        size="sm" 
        onClick={onCalcular}
        disabled={calculando}
        variant="outline"
        aria-label="Recalcular score SEO"
      >
        {calculando ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}