import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingUp } from "lucide-react";
import ReescritaComparacao from "./ReescritaComparacao";
import ReescritaMelhorias from "./ReescritaMelhorias";

export default function ReescritaResultado({ resultado, textoOriginal, onAplicar }) {
  if (!resultado) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border-2 border-indigo-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-sm">Texto Reescrito</h4>
          <Button
            size="sm"
            onClick={onAplicar}
            className="bg-indigo-600 hover:bg-indigo-700"
            aria-label="Aplicar texto reescrito"
          >
            <Check className="w-4 h-4 mr-2" aria-hidden="true" />
            Aplicar
          </Button>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {resultado.texto_reescrito}
        </p>
      </div>

      {resultado.analise && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" aria-hidden="true" />
                <span className="text-xs text-gray-600">Legibilidade</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                {resultado.analise.score_legibilidade || 0}/100
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" aria-hidden="true" />
                <span className="text-xs text-gray-600">Conversão</span>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {resultado.analise.score_conversao || 0}/100
              </p>
            </div>
          </div>

          <ReescritaComparacao
            palavrasOriginais={resultado.analise.palavras_originais}
            palavrasReescritas={resultado.analise.palavras_reescritas}
          />

          <ReescritaMelhorias melhorias={resultado.analise.melhorias} />
        </>
      )}
    </div>
  );
}