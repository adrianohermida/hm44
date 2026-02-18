import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function MesclarAdvogadosModal({ open, onClose, advogados, escritorioId }) {
  const [manterIdx, setManterIdx] = useState(0);
  const queryClient = useQueryClient();

  const mesclarMutation = useMutation({
    mutationFn: async () => {
      const advogadoManter = advogados[manterIdx];
      
      // Buscar todas as partes que têm esses advogados
      const partes = await base44.entities.ProcessoParte.filter({ escritorio_id: escritorioId });
      
      for (const parte of partes) {
        if (!parte.advogados || parte.advogados.length === 0) continue;
        
        let updated = false;
        const novosAdvogados = parte.advogados.filter((adv, idx) => {
          const matches = advogados.some(a => 
            a.nome === adv.nome && 
            a.oab_numero === adv.oab_numero && 
            a.oab_uf === adv.oab_uf
          );
          
          if (matches && idx !== parte.advogados.findIndex(a => 
            a.nome === advogadoManter.nome && 
            a.oab_numero === advogadoManter.oab_numero && 
            a.oab_uf === advogadoManter.oab_uf
          )) {
            updated = true;
            return false;
          }
          return true;
        });
        
        // Adicionar o advogado mantido se não existir
        if (!novosAdvogados.some(a => 
          a.nome === advogadoManter.nome && 
          a.oab_numero === advogadoManter.oab_numero && 
          a.oab_uf === advogadoManter.oab_uf
        )) {
          novosAdvogados.push(advogadoManter);
          updated = true;
        }
        
        if (updated) {
          await base44.entities.ProcessoParte.update(parte.id, { advogados: novosAdvogados });
        }
      }
      
      return advogadoManter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['advogados-cadastrados']);
      toast.success('Advogados mesclados com sucesso');
      onClose();
    },
    onError: () => toast.error('Erro ao mesclar advogados')
  });

  if (!advogados || advogados.length < 2) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mesclar Advogados Duplicados</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Atenção: Esta ação não pode ser desfeita</p>
              <p>Selecione qual registro manter. As demais referências serão atualizadas.</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Selecione o registro a manter ({advogados.length} duplicados encontrados):
            </p>
            {advogados.map((adv, idx) => (
              <div
                key={idx}
                onClick={() => setManterIdx(idx)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  manterIdx === idx
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]'
                    : 'border-[var(--border-primary)] hover:border-[var(--brand-primary-300)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5 text-[var(--brand-primary-700)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--text-primary)]">{adv.nome}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {adv.oab_numero && adv.oab_uf && (
                        <Badge className="bg-[var(--brand-primary)] text-white">
                          OAB {adv.oab_numero}/{adv.oab_uf}
                        </Badge>
                      )}
                      {adv.cpf && (
                        <span className="text-sm text-[var(--text-secondary)]">CPF: {adv.cpf}</span>
                      )}
                      {adv.processos && (
                        <Badge variant="secondary">
                          {adv.processos} processo(s)
                        </Badge>
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