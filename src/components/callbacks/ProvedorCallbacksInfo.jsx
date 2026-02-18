import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook } from 'lucide-react';

export default function ProvedorCallbacksInfo({ provedor }) {
  if (!provedor?.eventos_callback_disponiveis) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Webhook className="w-4 h-4" />
          Eventos de Callback Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {provedor.eventos_callback_disponiveis.map(evento => (
            <Badge key={evento} variant="outline">{evento}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}