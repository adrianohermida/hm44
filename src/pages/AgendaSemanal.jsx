import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Save, Building2, User } from 'lucide-react';
import { toast } from 'sonner';
import ConfiguracaoRecessoForense from '@/components/agenda/ConfiguracaoRecessoForense';
import PeriodosIndisponibilidade from '@/components/agenda/PeriodosIndisponibilidade';
import WeeklyScheduleManager from '@/components/calendar/WeeklyScheduleManager';

export default function AgendaSemanal() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('escritorio');
  const [configEscritorio, setConfigEscritorio] = useState({});
  const [configUsuario, setConfigUsuario] = useState({});

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: configsEscritorio = [] } = useQuery({
    queryKey: ['config-agenda-escritorio', escritorio?.id],
    queryFn: () => base44.entities.ConfiguracaoAgenda.filter({ tipo: 'escritorio', escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const { data: configsUsuario = [] } = useQuery({
    queryKey: ['config-agenda-usuario', user?.email],
    queryFn: () => base44.entities.ConfiguracaoAgenda.filter({ tipo: 'usuario', user_email: user.email }),
    enabled: !!user
  });

  useEffect(() => {
    if (configsEscritorio[0]) {
      setConfigEscritorio(configsEscritorio[0]);
    } else if (escritorio) {
      setConfigEscritorio({
        tipo: 'escritorio',
        escritorio_id: escritorio.id,
        recesso_forense_ativo: false,
        permitir_tickets_urgentes: true,
        periodos_indisponibilidade: []
      });
    }
  }, [configsEscritorio, escritorio]);

  useEffect(() => {
    if (configsUsuario[0]) {
      setConfigUsuario(configsUsuario[0]);
    } else if (user) {
      setConfigUsuario({
        tipo: 'usuario',
        user_email: user.email,
        periodos_indisponibilidade: []
      });
    }
  }, [configsUsuario, user]);

  const saveMutation = useMutation({
    mutationFn: async ({ config }) => {
      if (config.id) {
        return base44.entities.ConfiguracaoAgenda.update(config.id, config);
      } else {
        return base44.entities.ConfiguracaoAgenda.create(config);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['config-agenda-escritorio']);
      queryClient.invalidateQueries(['config-agenda-usuario']);
      toast.success('Configurações salvas');
    }
  });

  const handleSave = () => {
    if (activeTab === 'escritorio') {
      saveMutation.mutate({ config: configEscritorio });
    } else {
      saveMutation.mutate({ config: configUsuario });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[{ label: 'Configurações de Agenda' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <SettingsIcon className="w-8 h-8 text-[var(--brand-primary)]" />
              Configurações de Agenda
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Gerencie disponibilidade, recesso forense e períodos de indisponibilidade
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="escritorio" disabled={!isAdmin}>
              <Building2 className="w-4 h-4 mr-2" />
              Escritório
            </TabsTrigger>
            <TabsTrigger value="usuario">
              <User className="w-4 h-4 mr-2" />
              Pessoal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="escritorio" className="space-y-6">
            {isAdmin ? (
              <>
                <ConfiguracaoRecessoForense
                  config={configEscritorio}
                  onChange={setConfigEscritorio}
                />
                <PeriodosIndisponibilidade
                  config={configEscritorio}
                  onChange={setConfigEscritorio}
                />
                <WeeklyScheduleManager />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--text-secondary)]">
                  Apenas administradores podem configurar a agenda do escritório
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="usuario" className="space-y-6">
            <PeriodosIndisponibilidade
              config={configUsuario}
              onChange={setConfigUsuario}
            />
            <WeeklyScheduleManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}