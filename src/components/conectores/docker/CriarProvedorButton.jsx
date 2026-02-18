import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

export default function CriarProvedorButton({ analise }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const criarProvedorMutation = useMutation({
    mutationFn: async () => {
      const { data } = await base44.functions.invoke('criarProvedorDeAnalise', {
        analise_id: analise.id
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.sucesso) {
        toast.success(data.mensagem);
        queryClient.invalidateQueries(['provedores']);
        setConfirmOpen(false);
      } else {
        toast.error(data.erro || 'Erro ao criar provedor');
      }
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const metadados = analise.metadados_extraidos;
  const provedorJaCriado = metadados?.provedor_criado_id;

  if (provedorJaCriado) {
    return (
      <Button variant="outline" size="sm" disabled>
        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
        Provedor Criado
      </Button>
    );
  }

  return (
    <>
      <Button 
        onClick={() => setConfirmOpen(true)} 
        size="sm"
        className="bg-[var(--brand-primary)]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Criar Provedor
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Provedor</DialogTitle>
            <DialogDescription>
              Isso criará automaticamente um provedor baseado nos metadados extraídos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4">
            <div className="bg-[var(--bg-secondary)] p-3 rounded-lg text-sm space-y-2">
              <div>
                <span className="text-[var(--text-tertiary)]">Nome:</span>
                <span className="ml-2 font-semibold">{metadados?.nome_api || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)]">Base URL:</span>
                <code className="ml-2 text-xs bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                  {metadados?.base_url || 'N/A'}
                </code>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)]">Autenticação:</span>
                <Badge className="ml-2">{metadados?.autenticacao?.tipo || 'N/A'}</Badge>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Após criar o provedor, você poderá associar os endpoints extraídos
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => criarProvedorMutation.mutate()}
              disabled={criarProvedorMutation.isPending}
              className="bg-[var(--brand-primary)]"
            >
              {criarProvedorMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Criar Provedor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}