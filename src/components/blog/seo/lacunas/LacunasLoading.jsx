import React from "react";
import { Loader2 } from "lucide-react";

export default function LacunasLoading() {
  return (
    <div className="text-center py-6 sm:py-8" role="status" aria-live="polite">
      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto text-orange-600 mb-2" aria-hidden="true" />
      <p className="text-xs sm:text-sm text-gray-600">Identificando lacunas...</p>
    </div>
  );
}