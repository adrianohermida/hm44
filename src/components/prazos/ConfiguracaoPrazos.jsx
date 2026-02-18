import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';

export default function ConfiguracaoPrazos({ workspace, darkMode = false }) {
  const { data: regras = [] } = useQuery({
    queryKey: ['regras-prazo'],
    queryFn: () => base44.entities.RegraPrazo.list('name', 100)
  });

  const { data: feriados = [] } = useQuery({
    queryKey: ['feriados'],
    queryFn: () => base44.entities.Feriado.list('date', 100)
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Regras de Prazo
          </CardTitle>
          <CardDescription>{regras.length} regras cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {regras.slice(0, 10).map(regra => (
              <div key={regra.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{regra.name}</span>
                <Badge variant="outline">{regra.dias} dias</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Feriados
          </CardTitle>
          <CardDescription>{feriados.length} feriados cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {feriados.slice(0, 10).map(feriado => (
              <div key={feriado.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{feriado.name}</span>
                <Badge variant="outline">{feriado.date}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}