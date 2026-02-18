import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ModuloNav from '@/components/conectores/ModuloNav';
import { Button } from '@/components/ui/button';
import { Plus, Webhook } from 'lucide-react';
import WebhookCard from '@/components/callbacks/WebhookCard';
import WebhookFormModal from '@/components/callbacks/WebhookFormModal';
import WebhookLogsModal from '@/components/callbacks/WebhookLogsModal';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';

export default function AdminCallbacks() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewingLogs, setViewingLogs] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    },
    enabled: !!user?.email
  });

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return await base44.entities.WebhookConector.filter({ escritorio_id: escritorio.id });
    },
    enabled: !!escritorio?.id
  });

  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return await base44.entities.ProvedorAPI.filter({ escritorio_id: escritorio.id });
    },
    enabled: !!escritorio?.id
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Callbacks' }
      ]} />
      <ModuloNav />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Webhook className="w-8 h-8" />
            Webhooks & Callbacks
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gerencie webhooks para receber notificações dos provedores
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />Novo Webhook
        </Button>
      </div>

      {isLoading ? (
        <LoadingState message="Carregando webhooks..." />
      ) : webhooks.length === 0 ? (
        <EmptyState 
          title="Nenhum webhook cadastrado"
          description="Configure webhooks para receber notificações em tempo real"
          action={<Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" />Criar Webhook</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {webhooks.map(webhook => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              provedor={provedores.find(p => p.id === webhook.provedor_id)}
              onEdit={(w) => { setEditing(w); setShowForm(true); }}
              onViewLogs={setViewingLogs}
            />
          ))}
        </div>
      )}

      {showForm && (
        <WebhookFormModal
          webhook={editing}
          provedores={provedores}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {viewingLogs && (
        <WebhookLogsModal
          webhook={viewingLogs}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
}