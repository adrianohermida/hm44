import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TemplatePreviewModal({ template, onClose, onConfirm }) {
  if (!template) return null;

  const categoriaLabels = {
    boas_vindas: '👋 Boas-vindas',
    confirmacao: '✅ Confirmação',
    resolucao: '🎯 Resolução',
    follow_up: '📬 Follow-up',
    outro: '📝 Outros'
  };

  return (
    <Dialog open={!!template} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
            Preview: {template.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {categoriaLabels[template.categoria] || template.categoria}
            </Badge>
            {template.atalho && (
              <Badge className="bg-[var(--brand-primary)]">
                {template.atalho}
              </Badge>
            )}
            {template.vezes_usado > 0 && (
              <Badge variant="secondary">
                Usado {template.vezes_usado}×
              </Badge>
            )}
          </div>

          {template.assunto && (
            <div>
              <h4 className="text-sm font-semibold mb-1 text-[var(--text-secondary)]">
                Assunto
              </h4>
              <div className="p-3 bg-[var(--bg-tertiary)] rounded text-sm">
                {template.assunto}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold mb-1 text-[var(--text-secondary)]">
              Corpo da Mensagem
            </h4>
            <ScrollArea className="h-64 p-3 bg-[var(--bg-tertiary)] rounded">
              <div className="text-sm whitespace-pre-wrap">
                {template.corpo}
              </div>
            </ScrollArea>
          </div>

          {template.variaveis && template.variaveis.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-1 text-[var(--text-secondary)]">
                Variáveis Detectadas
              </h4>
              <div className="flex flex-wrap gap-1">
                {template.variaveis.map(v => (
                  <code key={v} className="text-xs px-2 py-1 bg-[var(--bg-tertiary)] rounded">
                    {v}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => { onConfirm(template); onClose(); }}>
            <Check className="w-4 h-4 mr-2" />
            Aplicar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}