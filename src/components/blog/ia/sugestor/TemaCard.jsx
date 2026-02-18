import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import TemaHeader from "./tema/TemaHeader";
import TemaMetrics from "./tema/TemaMetrics";
import TemaMotivo from "./tema/TemaMotivo";
import TemaKeywords from "./tema/TemaKeywords";

export default function TemaCard({ tema, onSelect }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border-2 hover:border-purple-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <TemaHeader tema={tema} />
        <Button
          size="sm"
          onClick={() => onSelect && onSelect(tema)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          aria-label={`Usar tema: ${tema.titulo}`}
        >
          <span className="sm:hidden">Usar</span>
          <span className="hidden sm:inline">Usar Tema</span>
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Button>
      </div>

      <TemaMetrics tema={tema} />
      <TemaMotivo motivo={tema.motivo} />
      <TemaKeywords keywords={tema.keywords_relacionadas} />
    </div>
  );
}