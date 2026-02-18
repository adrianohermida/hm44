import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function BannerSolicitacaoCopia({ processo, processosApensos = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorios = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list()
  });

  const solicitarMutation = useMutation({
    mutationFn: async () => {
      const solicitacao = await base44.entities.SolicitacaoCopiaEletronicaCliente.create({
        processo_id: processo.id,
        cliente_email: user?.email,
        escritorio_id: escritorios[0]?.id,
        status: 'pendente_pagamento',
        valor: 39.90,
        data_solicitacao: new Date().toISOString()
      });
      return solicitacao;
    },
    onSuccess: () => {
      toast.success('Solicitação criada! Redirecionando para pagamento...');
      setShowModal(false);
      setDismissed(true);
      // TODO: Redirecionar para Stripe checkout
      setTimeout(() => {
        window.location.href = '/checkout-copia';
      }, 1500);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  if (dismissed || !processo || !user || !escritorios.length) return null;

  const processosRelacionados = [processo, ...processosApensos].length;

  return (
    <>
      {/* Banner */}
      <div className="bg-[var(--brand-primary)]/10 border-l-4 border-[var(--brand-primary)] p-4 flex items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-3 flex-1">
          <Download className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              Obtenha Cópia Eletrônica
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Receba os documentos deste processo em PDF por apenas R$ 39,90
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-[var(--brand-primary)] text-white whitespace-nowrap"
            size="sm"
          >
            Solicitar
          </Button>
          <Button
            onClick={() => setDismissed(true)}
            variant="ghost"
            size="sm"
            className="text-[var(--text-secondary)]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Cópia Eletrônica</DialogTitle>
            <DialogDescription>
              Você está solicitando a cópia eletrônica deste processo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Detalhes */}
            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Processos:</span>
                <Badge>{processosRelacionados}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Valor:</span>
                <span className="font-semibold">R$ 39,90</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--border-primary)]">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-[var(--brand-primary)]">R$ 39,90</span>
              </div>
            </div>

            {/* Info */}
            <div className="text-xs text-[var(--text-secondary)] space-y-1">
              <p>✓ PDF com todos os documentos do processo</p>
              <p>✓ Disponível para download por 30 dias</p>
              <p>✓ Pagamento seguro via Stripe</p>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => solicitarMutation.mutate()}
                className="flex-1 bg-[var(--brand-primary)]"
                disabled={solicitarMutation.isPending}
              >
                {solicitarMutation.isPending ? 'Processando...' : 'Prosseguir'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}