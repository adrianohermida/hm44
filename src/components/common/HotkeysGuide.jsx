import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';
import { HOTKEYS_MAP } from '@/components/hooks/useHotkeys';

const ACTIONS_LABELS = {
  search: 'Buscar',
  new: 'Novo',
  edit: 'Editar',
  save: 'Salvar',
  delete: 'Deletar',
  close: 'Fechar',
  help: 'Ajuda',
  goGeral: 'Ir para Visão Geral',
  goHistorico: 'Ir para Histórico',
  goDocumentos: 'Ir para Documentos',
  goFinanceiro: 'Ir para Financeiro',
  goAnalytics: 'Ir para Analytics',
  refresh: 'Atualizar processo',
  exportPDF: 'Exportar PDF',
  toggleMonitor: 'Ativar/Desativar monitoramento'
};

export default function HotkeysGuide({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-label="Guia de atalhos de teclado">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" aria-hidden="true" />Atalhos de Teclado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2" role="list">
          {Object.entries(HOTKEYS_MAP).map(([key, action]) => (
            <div key={key} className="flex items-center justify-between p-2 rounded bg-[var(--bg-secondary)]" role="listitem">
              <span className="text-sm text-[var(--text-secondary)]">{ACTIONS_LABELS[action]}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded shadow-sm">
                {key.toUpperCase()}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}