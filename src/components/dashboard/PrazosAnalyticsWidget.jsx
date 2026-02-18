import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PrazosAnalyticsWidget() {
  const navigate = useNavigate();
  
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: prazos = [] } = useQuery({
    queryKey: ['prazos-widget'],
    queryFn: () => base44.entities.Prazo.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const urgentes = prazos.filter(p => {
    const dias = Math.ceil((new Date(p.data_vencimento) - new Date()) / (1000 * 60 * 60 * 24));
    return dias >= 0 && dias < 3 && p.status !== 'cumprido';
  }).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Prazos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-2xl font-bold">{prazos.length}</span>
        </div>
        {urgentes > 0 && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{urgentes} urgentes</span>
          </div>
        )}
        <Button 
          onClick={() => navigate(createPageUrl('PrazosAnalytics'))}
          className="w-full"
          variant="outline"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Ver Analytics
        </Button>
      </CardContent>
    </Card>
  );
}