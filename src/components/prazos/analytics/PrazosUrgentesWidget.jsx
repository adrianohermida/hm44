import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PrazosUrgentesWidget({ prazos }) {
  const navigate = useNavigate();
  
  const urgentes = prazos
    .filter(p => {
      const dias = Math.ceil((new Date(p.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24));
      return dias >= 0 && dias < 3 && p.status !== 'cumprido';
    })
    .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento))
    .slice(0, 5);

  if (urgentes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          Prazos Urgentes (próximos 3 dias)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {urgentes.map(prazo => (
          <div key={prazo.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{prazo.titulo}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(prazo.data_vencimento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Badge variant="destructive">
              {Math.ceil((new Date(prazo.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24))}d
            </Badge>
          </div>
        ))}
        <Button 
          onClick={() => navigate(createPageUrl('Prazos'))}
          className="w-full"
          variant="outline"
        >
          Ver Todos os Prazos
        </Button>
      </CardContent>
    </Card>
  );
}