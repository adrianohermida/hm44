import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import NotificacaoConfigForm from './NotificacaoConfigForm';
import NotificacaoConfigList from './NotificacaoConfigList';

export default function NotificacoesPrazosAvancadas() {
  const [showForm, setShowForm] = useState(false);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const { data: configs, isLoading } = useQuery({
    queryKey: ['notificacoes-prazos'],
    queryFn: () => base44.entities.ConfiguracaoNotificacaoPrazo.filter({
      escritorio_id: escritorio.id
    }),
    enabled: !!escritorio
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações Avançadas
          </CardTitle>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <NotificacaoConfigForm
            escritorioId={escritorio.id}
            onSuccess={() => setShowForm(false)}
            onCancel={() => setShowForm(false)}
          />
        )}
        <NotificacaoConfigList configs={configs} />
      </CardContent>
    </Card>
  );
}