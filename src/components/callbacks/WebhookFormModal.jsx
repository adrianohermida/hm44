import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import EventosSeletor from './EventosSeletor';
import RetryPolicyConfig from './RetryPolicyConfig';

export default function WebhookFormModal({ webhook, provedores, onClose }) {
  const [form, setForm] = useState({
    nome: webhook?.nome || '',
    provedor_id: webhook?.provedor_id || '',
    endpoint_id: webhook?.endpoint_id || '',
    token_validacao: webhook?.token_validacao || crypto.randomUUID(),
    timeout_ms: webhook?.timeout_ms || 30000,
    eventos_suportados: webhook?.eventos_suportados || [],
    retry_config: webhook?.retry_config || { max_tentativas: 3, intervalo_ms: 5000 }
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (user?.role === 'admin' && user?.email === 'adrianohermida@gmail.com') {
        const result = await base44.entities.Escritorio.list();
        return result[0];
      }
      const result = await base44.entities.Escritorio.filter({ created_by: user.email });
      return result[0];
    },
    enabled: !!user
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        escritorio_id: escritorio.id,
        url_webhook: `${window.location.origin}/api/webhooks/${crypto.randomUUID()}`
      };
      if (webhook) {
        return base44.entities.WebhookConector.update(webhook.id, payload);
      }
      return base44.entities.WebhookConector.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      toast.success(webhook ? 'Webhook atualizado' : 'Webhook criado');
      onClose();
    }
  });

  const provedorSelecionado = provedores.find(p => p.id === form.provedor_id);
  const eventosDisponiveis = provedorSelecionado?.eventos_callback_disponiveis || [];

  const toggleEvento = (evento) => {
    const updated = form.eventos_suportados.includes(evento)
      ? form.eventos_suportados.filter(e => e !== evento)
      : [...form.eventos_suportados, evento];
    setForm({ ...form, eventos_suportados: updated });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{webhook ? 'Editar' : 'Novo'} Webhook</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome identificador do webhook"
            />
          </div>

          <div>
            <Label>Provedor</Label>
            <Select value={form.provedor_id} onValueChange={(v) => setForm({ ...form, provedor_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent>
                {provedores.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Token de Validação</Label>
            <Input
              value={form.token_validacao}
              onChange={(e) => setForm({ ...form, token_validacao: e.target.value })}
              placeholder="Token secreto"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Use este token para validar chamadas recebidas
            </p>
          </div>

          <div>
            <Label>Timeout (ms)</Label>
            <Input
              type="number"
              value={form.timeout_ms}
              onChange={(e) => setForm({ ...form, timeout_ms: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label>Eventos Suportados</Label>
            {eventosDisponiveis.length > 0 ? (
              <EventosSeletor
                eventos={eventosDisponiveis}
                selected={form.eventos_suportados}
                onToggle={toggleEvento}
              />
            ) : (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Selecione um provedor para ver eventos disponíveis
              </p>
            )}
          </div>

          <RetryPolicyConfig
            config={form.retry_config}
            onChange={(config) => setForm({ ...form, retry_config: config })}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={!form.nome || !form.provedor_id}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}