import React from "react";
import { Sparkles } from "lucide-react";

export default function SugestorEmpty() {
  return (
    <div className="text-center py-8 sm:py-12 text-gray-500">
      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
      <p className="text-sm sm:text-base font-medium">Nenhuma sugestão ainda</p>
      <p className="text-xs sm:text-sm mt-1">Clique em "Gerar" para receber sugestões de temas</p>
    </div>
  );
}