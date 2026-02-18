import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, XCircle, AlertTriangle } from "lucide-react";

export default function ProblemasLista({ problemas }) {
  if (!problemas || problemas.length === 0) return null;

  const getSeveridadeIcon = (sev) => {
    if (sev === 'critica') return <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />;
    if (sev === 'alta') return <AlertCircle className="w-4 h-4 text-orange-600" aria-hidden="true" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" aria-hidden="true" />;
  };

  const getSeveridadeColor = (sev) => {
    if (sev === 'critica') return 'bg-red-100 text-red-800';
    if (sev === 'alta') return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-gray-700">🚨 Problemas Detectados</p>
      {problemas.map((prob, i) => (
        <div key={i} className="bg-white p-3 rounded-lg border-l-4 border-red-500">
          <div className="flex items-start gap-2">
            {getSeveridadeIcon(prob.severidade)}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className={getSeveridadeColor(prob.severidade)}>
                  {prob.tipo}
                </Badge>
                {prob.localizacao && (
                  <span className="text-xs text-gray-500">{prob.localizacao}</span>
                )}
              </div>
              <p className="text-xs text-gray-700 mb-2">{prob.descricao}</p>
              {prob.sugestao && (
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <span className="font-semibold text-blue-900">💡 Sugestão: </span>
                  <span className="text-blue-800">{prob.sugestao}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}