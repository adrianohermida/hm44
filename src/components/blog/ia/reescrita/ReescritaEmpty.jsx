import React from "react";
import { Wand2 } from "lucide-react";

export default function ReescritaEmpty() {
  return (
    <div className="text-center py-8 sm:py-12 text-gray-500">
      <Wand2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
      <p className="text-sm sm:text-base font-medium">Selecione texto para reescrever</p>
      <p className="text-xs sm:text-sm mt-1">Escolha o objetivo e clique em "Reescrever"</p>
    </div>
  );
}