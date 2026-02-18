import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function MergeEndpointsModal({ endpoints, onClose }) {
  const [merging, setMerging] = useState(false);
  const queryClient = useQueryClient();

  const merge = async () => {
    setMerging(true);
    try {
      const [primary, ...others] = endpoints;
      const merged = { ...primary };

      others.forEach(ep => {
        if (ep.descricao && !merged.descricao) merged.descricao = ep.descricao;
        if (ep.parametros_obrigatorios?.length && !merged.parametros_obrigatorios?.length) {
          merged.parametros_obrigatorios = ep.parametros_obrigatorios;
        }
        if (ep.parametros_opcionais?.length && !merged.parametros_opcionais?.length) {
          merged.parametros_opcionais = ep.parametros_opcionais;
        }
        if (ep.schema_resposta && !merged.schema_resposta) {
          merged.schema_resposta = ep.schema_resposta;
        }
      });

      await base44.entities.EndpointAPI.update(primary.id, merged);
      
      for (const ep of others) {
        await base44.entities.EndpointAPI.delete(ep.id);
      }

      queryClient.invalidateQueries(['endpoints']);
      toast.success(`${endpoints.length} endpoints mesclados com sucesso`);
      onClose();
    } catch (err) {
      toast.error('Erro ao mesclar: ' + err.message);
    } finally {
      setMerging(false);
    }
  };

  return (
    <Dialog open={!!endpoints} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Mesclar {endpoints.length} Endpoints Duplicados
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            O primeiro endpoint será mantido e atualizado com dados dos outros.
            Os demais serão deletados.
          </p>
          {endpoints.map((ep, idx) => (
            <div key={ep.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {idx === 0 && <Badge className="bg-green-600">Principal</Badge>}
                <Badge variant="outline">{ep.metodo}</Badge>
                <span className="font-semibold">{ep.nome}</span>
              </div>
              <code className="text-xs text-[var(--text-tertiary)]">{ep.path}</code>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={merge} disabled={merging}>
            {merging ? 'Mesclando...' : 'Confirmar Mesclagem'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}