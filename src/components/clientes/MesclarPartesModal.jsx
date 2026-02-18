import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Building2, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function MesclarPartesModal({ open, onClose, partes }) {
  const [manterId, setManterId] = useState(partes[0]?.id);
  const queryClient = useQueryClient();

  const mesclarMutation = useMutation({
    mutationFn: async () => {
      const manter = partes.find(p => p.id === manterId);
      const remover = partes.filter(p => p.id !== manterId);

      // Mesclar dados das partes removidas na parte mantida
      const advogadosMesclados = [...(manter.advogados || [])];
      const cpfCnjpAtualizado = manter.cpf_cnpj;
      
      remover.forEach(p => {
        // Mesclar advogados
        p.advogados?.forEach(adv => {
          const jaExiste = advogadosMesclados.some(a => 
            a.email === adv.email || 
            (a.oabs?.[0] && adv.oabs?.[0] && 
             a.oabs[0].numero === adv.oabs[0].numero && 
             a.oabs[0].uf === adv.oabs[0].uf)
          );
          if (!jaExiste) advogadosMesclados.push(adv);
        });
      });

      // Atualizar parte mantida com dados mesclados
      await base44.entities.ProcessoParte.update(manter.id, {
        advogados: advogadosMesclados,
        cpf_cnpj: cpfCnjpAtualizado || remover[0]?.cpf_cnpj,
        e_cliente_escritorio: manter.e_cliente_escritorio || remover.some(p => p.e_cliente_escritorio),
        cliente_id: manter.cliente_id || remover.find(p => p.cliente_id)?.cliente_id
      });

      // Se houver cliente_id, sincronizar o cliente
      const cliente_id = manter.cliente_id || remover.find(p => p.cliente_id)?.cliente_id;
      if (cliente_id) {
        await base44.functions.invoke('sincronizarParteComCliente', {
          parte_id: manter.id,
          cliente_id
        });
      }

      // Deletar partes removidas
      for (const p of remover) {
        await base44.entities.ProcessoParte.delete(p.id);
      }

      return manter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partes-cadastradas']);
      queryClient.invalidateQueries(['all-clientes']);
      toast.success('Partes mescladas e sincronizadas com sucesso');
      onClose();
    },
    onError: (error) => toast.error('Erro ao mesclar partes: ' + error.message)
  });

  if (!partes || partes.length < 2) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mesclar Partes Duplicadas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Atenção: Esta ação não pode ser desfeita</p>
              <p>Selecione qual registro manter. Os demais serão excluídos.</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Selecione o registro a manter ({partes.length} duplicados encontrados):
            </p>
            {partes.map(parte => (
              <div
                key={parte.id}
                onClick={() => setManterId(parte.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  manterId === parte.id
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]'
                    : 'border-[var(--border-primary)] hover:border-[var(--brand-primary-300)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
                    {parte.tipo_pessoa === 'fisica' ? 
                      <User className="w-5 h-5 text-[var(--brand-primary-700)]" /> : 
                      <Building2 className="w-5 h-5 text-[var(--brand-primary-700)]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--text-primary)]">{parte.nome}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline">
                        {parte.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}
                      </Badge>
                      {parte.cpf_cnpj && (
                        <span className="text-sm text-[var(--text-secondary)]">{parte.cpf_cnpj}</span>
                      )}
                      <Badge className="bg-[var(--brand-primary)] text-white">
                        {parte.tipo_parte === 'polo_ativo' ? 'Ativo' : parte.tipo_parte === 'polo_passivo' ? 'Passivo' : 'Terceiro'}
                      </Badge>
                      {parte.qualificacao && (
                        <span className="text-xs text-[var(--text-secondary)]">{parte.qualificacao}</span>
                      )}
                      {parte.e_cliente_escritorio && (
                        <Badge className="bg-green-100 text-green-800">Cliente</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={() => mesclarMutation.mutate()}
            disabled={mesclarMutation.isPending}
          >
            {mesclarMutation.isPending ? 'Mesclando...' : 'Confirmar Mesclagem'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}