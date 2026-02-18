import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProcessoAudienciaItem from './ProcessoAudienciaItem';

export default function ProcessoAudienciasLista({ audiencias }) {
  if (!audiencias || audiencias.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Audiências ({audiencias.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {audiencias.map((aud, idx) => (
            <ProcessoAudienciaItem key={idx} audiencia={aud} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}