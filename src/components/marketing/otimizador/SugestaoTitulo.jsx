import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react";

export default function SugestaoTitulo({ sugestao, aceito, onToggle }) {
  const getRiscoColor = (risco) => {
    if (risco === 'baixo') return 'bg-green-100 text-green-800';
    if (risco === 'medio') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white p-3 rounded-lg border-2 border-purple-200">
      <div className="flex items-start gap-3 mb-2">
        <Checkbox
          checked={aceito}
          onCheckedChange={onToggle}
          className="mt-1"
          aria-label="Aceitar sugestão de título"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-100 text-purple-800">Título</Badge>
            <Badge className={getRiscoColor(sugestao.risco)}>
              Risco: {sugestao.risco}
            </Badge>
            {sugestao.impacto_seo > 0 && (
              <Badge className="bg-blue-100 text-blue-800">
                <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                +{sugestao.impacto_seo} SEO
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-600 mb-1">Original:</p>
              <p className="font-medium">{sugestao.original}</p>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="text-gray-600 mb-1">Sugestão:</p>
              <p className="font-medium text-green-900">{sugestao.sugestao}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-green-50 p-2 rounded">
              <p className="flex items-center gap-1 text-xs font-bold text-green-900 mb-1">
                <ThumbsUp className="w-3 h-3" aria-hidden="true" />
                Prós
              </p>
              <ul className="text-xs space-y-1">
                {sugestao.pros?.map((pro, i) => (
                  <li key={i} className="text-green-800">• {pro}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <p className="flex items-center gap-1 text-xs font-bold text-red-900 mb-1">
                <ThumbsDown className="w-3 h-3" aria-hidden="true" />
                Contras
              </p>
              <ul className="text-xs space-y-1">
                {sugestao.contras?.map((contra, i) => (
                  <li key={i} className="text-red-800">• {contra}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}