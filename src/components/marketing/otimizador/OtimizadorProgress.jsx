import React from "react";
import { Loader2 } from "lucide-react";

export default function OtimizadorProgress() {
  return (
    <div className="text-center py-8 sm:py-12" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto text-purple-600 mb-3" aria-hidden="true" />
      <p className="text-xs sm:text-sm text-gray-600">Analisando conteúdo...</p>
      <p className="text-xs text-gray-500 mt-1">Gerando sugestões granulares</p>
    </div>
  );
}