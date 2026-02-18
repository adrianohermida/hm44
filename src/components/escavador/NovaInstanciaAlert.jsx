import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ExternalLink } from 'lucide-react';

export default function NovaInstanciaAlert({ instancia, url, sistema }) {
  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <p className="font-semibold text-sm text-blue-900">Nova Instância Detectada</p>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline">{instancia}</Badge>
        <Badge variant="outline">{sistema}</Badge>
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          Ver no tribunal
        </a>
      )}
    </div>
  );
}