import React from "react";
import { Loader2 } from "lucide-react";

export default function DetectorLoading() {
  return (
    <div className="text-center py-8 sm:py-12" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin mx-auto text-red-600 mb-3" aria-hidden="true" />
      <p className="text-xs sm:text-sm text-gray-600">Analisando qualidade do conteúdo...</p>
      <p className="text-xs text-gray-500 mt-1">Detectando duplicação e pontos fracos</p>
    </div>
  );
}