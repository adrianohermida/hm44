import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";

export default function SugestaoTopico({ sugestao, indice, aceito, onToggle }) {
  const getRiscoColor = (risco) => {
    if (risco === 'baixo') return 'bg-green-100 text-green-800';
    if (risco === 'medio') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white p-3 rounded-lg border">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={aceito}
          onCheckedChange={onToggle}
          className="mt-1"
          aria-label={`Aceitar sugestão do tópico ${indice + 1}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">Tópico {indice + 1}</Badge>
            <Badge className={getRiscoColor(sugestao.risco)}>
              {sugestao.risco}
            </Badge>
            {sugestao.impacto_seo > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                +{sugestao.impacto_seo}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-xs mb-2">
            <p className="text-gray-600">
              <span className="line-through">{sugestao.original}</span>
            </p>
            <p className="font-medium text-green-900">{sugestao.sugestao}</p>
          </div>

          <div className="flex gap-2 text-xs">
            <div className="flex-1 bg-green-50 p-2 rounded">
              <p className="font-bold text-green-900 mb-1">Prós:</p>
              {sugestao.pros?.slice(0, 2).map((p, i) => (
                <p key={i} className="text-green-800">• {p}</p>
              ))}
            </div>
            <div className="flex-1 bg-red-50 p-2 rounded">
              <p className="font-bold text-red-900 mb-1">Contras:</p>
              {sugestao.contras?.slice(0, 2).map((c, i) => (
                <p key={i} className="text-red-800">• {c}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}