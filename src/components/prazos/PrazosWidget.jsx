import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';
import PrazoWidgetItem from './PrazoWidgetItem';
import PrazoWidgetEmpty from './PrazoWidgetEmpty';
import PrazosWidgetSkeleton from './PrazosWidgetSkeleton';

export default function PrazosWidget() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: prazos, isLoading } = useQuery({
    queryKey: ['prazos-urgentes'],
    queryFn: async () => {
      const hoje = new Date();
      const limite = new Date();
      limite.setDate(hoje.getDate() + 7);

      return await base44.entities.Prazo.filter({
        escritorio_id: escritorio.id,
        status: 'pendente',
        data_vencimento: { $lte: limite.toISOString().split('T')[0] }
      }, '-data_vencimento', 5);
    },
    enabled: !!escritorio
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Prazos Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PrazosWidgetSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Prazos Urgentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!prazos || prazos.length === 0 ? (
          <PrazoWidgetEmpty />
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2 pr-4">
              {prazos.map(prazo => <PrazoWidgetItem key={prazo.id} prazo={prazo} />)}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}