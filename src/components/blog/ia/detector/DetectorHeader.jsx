import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";

export default function DetectorHeader({ analisando, disabled, onClick }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div>
        <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" aria-hidden="true" />
          Detector de Qualidade
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Identifica duplicação e conteúdo fraco
        </p>
      </div>
      <Button
        onClick={onClick}
        disabled={disabled || analisando}
        className="bg-red-600 hover:bg-red-700"
        aria-label="Analisar qualidade do conteúdo"
      >
        {analisando ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <Shield className="w-4 h-4" aria-hidden="true" />
        )}
        <span className="ml-2 hidden sm:inline">Analisar</span>
      </Button>
    </div>
  );
}