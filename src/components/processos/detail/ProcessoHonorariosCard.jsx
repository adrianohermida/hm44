import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus } from 'lucide-react';
import { toast } from 'sonner';
import HonorarioFormInline from './HonorarioFormInline';
import useClientePermissions from '@/components/hooks/useClientePermissions';

export default function ProcessoHonorariosCard({ processoId, clienteId, modo }) {
  const permissions = useClientePermissions(modo);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  
  if (!permissions.canSeeHonorarios) return null;

  const { data: honorarios = [] } = useQuery({
    queryKey: ['honorarios-processo', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Honorario.filter({ 
        processo_id: processoId,
        escritorio_id: user.escritorio_id
      });
    }
  });

  const { data: consumoAPI = [] } = useQuery({
    queryKey: ['consumo-api-processo', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      const processo = await base44.entities.Processo.filter({ id: processoId });
      if (!processo[0]?.numero_cnj) return [];
      
      const consumos = await base44.entities.ConsumoAPIExterna.filter({
        escritorio_id: user.escritorio_id,
        'parametros.numero_cnj': processo[0].numero_cnj
      });
      
      return consumos;
    },
    enabled: !!processoId
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.Honorario.create({
        ...data,
        escritorio_id: user.escritorio_id,
        processo_id: processoId,
        cliente_id: clienteId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['honorarios-processo']);
      setShowForm(false);
      toast.success('Honorário criado');
    }
  });

  const total = honorarios.reduce((sum, h) => sum + (h.valor_total || 0), 0);
  const pago = honorarios.reduce((sum, h) => sum + (h.valor_pago || 0), 0);
  const despesas = consumoAPI.reduce((sum, c) => sum + (c.custo_estimado || 0), 0);
  const totalComDespesas = total + despesas;
  const pendente = totalComDespesas - pago;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="w-4 h-4" />Honorários
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && <HonorarioFormInline onSave={createMutation.mutate} onCancel={() => setShowForm(false)} />}
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Honorários:</span>
          <span className="font-semibold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        {despesas > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-red-600">Despesas (APIs):</span>
            <span className="font-semibold text-red-600">+ R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between text-sm border-t border-[var(--border-primary)] pt-2">
          <span className="font-medium">Total:</span>
          <span className="font-bold">R$ {totalComDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-600">Pago:</span>
          <span className="font-semibold text-green-600">- R$ {pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-[var(--border-primary)] pt-2">
          <span className="font-medium text-orange-600">A Receber:</span>
          <span className="font-bold text-orange-600">R$ {pendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        {honorarios.length === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center py-2">Nenhum honorário registrado</p>
        )}
      </CardContent>
    </Card>
  );
}