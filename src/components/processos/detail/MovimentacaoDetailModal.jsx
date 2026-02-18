import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function MovimentacaoDetailModal({ movimentacao, open, onClose }) {
  if (!movimentacao) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {movimentacao.tipo_movimentacao || 'Movimentação'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-secondary)]">
              {format(new Date(movimentacao.data), "dd/MM/yyyy 'às' HH:mm")}
            </span>
          </div>

          {movimentacao.codigo_movimentacao && (
            <div>
              <span className="text-xs text-[var(--text-tertiary)]">Código CNJ:</span>
              <Badge variant="outline" className="ml-2">{movimentacao.codigo_movimentacao}</Badge>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm mb-2">Descrição</h4>
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
              {movimentacao.descricao}
            </p>
          </div>

          {movimentacao.ia_analise && (
            <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Análise IA</h4>
              <div className="space-y-2">
                {movimentacao.ia_analise.resumo && (
                  <p className="text-sm">{movimentacao.ia_analise.resumo}</p>
                )}
                {movimentacao.ia_analise.relevancia && (
                  <Badge className={movimentacao.ia_analise.relevancia === 'alta' ? 'bg-red-600' : ''}>
                    Relevância: {movimentacao.ia_analise.relevancia}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}