import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

export default function OtimizacaoProgressoReal({ etapas, progressoGeral }) {
  const getStatusIcon = (status) => {
    if (status === "concluido") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === "em_progresso") return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Progresso Geral</span>
          <span>{progressoGeral}%</span>
        </div>
        <Progress value={progressoGeral} className="h-3" />
      </div>

      <div className="space-y-2">
        {etapas.map((etapa, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(etapa.status)}
            <div className="flex-1">
              <p className="font-medium text-sm">{etapa.nome}</p>
              <Progress value={etapa.percentual} className="h-1 mt-1" />
            </div>
            <span className="text-xs text-gray-600">{etapa.percentual}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}