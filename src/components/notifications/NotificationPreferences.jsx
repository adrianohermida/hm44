import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Save } from 'lucide-react';
import { toast } from 'sonner';

const eventosDisponiveis = [
  { value: 'novo_processo', label: 'Novos Processos' },
  { value: 'atualizacao_processo', label: 'Atualizações de Processos' },
  { value: 'nova_tarefa', label: 'Novas Tarefas' },
  { value: 'tarefa_vencendo', label: 'Tarefas Vencendo' },
  { value: 'novo_prazo', label: 'Novos Prazos' },
  { value: 'prazo_vencendo', label: 'Prazos Vencendo' },
  { value: 'nova_consulta', label: 'Novas Consultas' },
  { value: 'nova_mensagem', label: 'Novas Mensagens' },
  { value: 'novo_ticket', label: 'Novos Tickets' },
];

export default function NotificationPreferences() {
  const [preferencias, setPreferencias] = useState({});
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  });

  const { data: prefsExistentes = [], isLoading } = useQuery({
    queryKey: ['preferencias-notificacao', user?.email],
    queryFn: () => base44.entities.PreferenciaNotificacao.filter({
      user_email: user.email,
      escritorio_id: escritorio[0].id,
    }),
    enabled: !!user && !!escritorio?.length,
    onSuccess: (data) => {
      const prefsMap = {};
      data.forEach(pref => {
        prefsMap[pref.tipo_evento] = {
          canal_in_app: pref.canal_in_app,
          canal_email: pref.canal_email,
          id: pref.id,
        };
      });
      setPreferencias(prefsMap);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (prefs) => {
      const promises = [];
      for (const [tipo_evento, config] of Object.entries(prefs)) {
        if (config.id) {
          promises.push(
            base44.entities.PreferenciaNotificacao.update(config.id, {
              canal_in_app: config.canal_in_app,
              canal_email: config.canal_email,
            })
          );
        } else {
          promises.push(
            base44.entities.PreferenciaNotificacao.create({
              user_email: user.email,
              tipo_evento,
              canal_in_app: config.canal_in_app,
              canal_email: config.canal_email,
              escritorio_id: escritorio[0].id,
            })
          );
        }
      }
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['preferencias-notificacao']);
      toast.success('Preferências salvas com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar preferências');
    },
  });

  const handleToggle = (evento, canal) => {
    setPreferencias(prev => ({
      ...prev,
      [evento]: {
        ...prev[evento],
        [canal]: !prev[evento]?.[canal],
      },
    }));
  };

  const handleSave = () => {
    saveMutation.mutate(preferencias);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Preferências de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-2 border-b">
            <div className="font-semibold text-sm">Evento</div>
            <div className="font-semibold text-sm flex items-center gap-2">
              <Bell className="w-4 h-4" />
              In-App
            </div>
            <div className="font-semibold text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </div>
          </div>

          {eventosDisponiveis.map((evento) => (
            <div key={evento.value} className="grid grid-cols-3 gap-4 items-center">
              <div className="text-sm">{evento.label}</div>
              <Switch
                checked={preferencias[evento.value]?.canal_in_app ?? true}
                onCheckedChange={() => handleToggle(evento.value, 'canal_in_app')}
              />
              <Switch
                checked={preferencias[evento.value]?.canal_email ?? false}
                onCheckedChange={() => handleToggle(evento.value, 'canal_email')}
              />
            </div>
          ))}

          <div className="pt-4 flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isLoading}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Preferências
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}