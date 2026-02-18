import React from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ConcorrenteCard({ concorrente, ranking }) {
  const scoreColor = concorrente.score_seo >= 80 ? 'text-green-600' : 
                     concorrente.score_seo >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white p-3 rounded-lg border hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-bold text-xs">#{ranking}</Badge>
          <span className={`text-xl font-bold ${scoreColor}`}>
            {concorrente.score_seo}/100
          </span>
        </div>
        <a 
          href={concorrente.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
          aria-label={`Abrir ${concorrente.titulo} em nova aba`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{concorrente.titulo}</h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-2">
        <div className="bg-blue-50 px-2 py-1 rounded">
          <span className="text-gray-600">Palavras:</span>
          <span className="font-bold ml-1">{concorrente.palavra_count}</span>
        </div>
        <div className="bg-purple-50 px-2 py-1 rounded">
          <span className="text-gray-600">H2:</span>
          <span className="font-bold ml-1">{concorrente.h2_count}</span>
        </div>
        {concorrente.trafego_organico_estimado > 0 && (
          <div className="bg-green-50 px-2 py-1 rounded">
            <span className="text-gray-600">Tráfego:</span>
            <span className="font-bold ml-1">{concorrente.trafego_organico_estimado.toLocaleString()}/mês</span>
          </div>
        )}
      </div>

      {(concorrente.backlinks_estimados > 0 || concorrente.domain_authority > 0) && (
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          {concorrente.backlinks_estimados > 0 && (
            <div className="bg-indigo-50 px-2 py-1 rounded">
              <span className="text-gray-600">Backlinks:</span>
              <span className="font-bold ml-1">{concorrente.backlinks_estimados}</span>
            </div>
          )}
          {concorrente.domain_authority > 0 && (
            <div className="bg-orange-50 px-2 py-1 rounded">
              <span className="text-gray-600">DA:</span>
              <span className="font-bold ml-1">{concorrente.domain_authority}/100</span>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-600 line-clamp-2">
        <strong>Pontos fortes:</strong> {concorrente.pontos_fortes}
      </p>
    </div>
  );
}