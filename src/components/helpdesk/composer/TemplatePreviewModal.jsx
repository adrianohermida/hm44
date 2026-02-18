import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TemplatePreviewModal({ template, ticket, open, onClose, onConfirm }) {
  const { data: preview, isLoading } = useQuery({
    queryKey: ['template-preview', template?.id, ticket?.id],
    queryFn: async () => {
      const response = await base44.functions.invoke('helpdesk/processarTemplateVariaveis', {
        template_id: template.id,
        ticket_id: ticket.id
      });
      return response.data;
    },
    enabled: !!template && !!ticket && open
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Preview: {template?.nome}
            {template?.atalho && (
              <Badge variant="outline" className="font-mono">
                {template.atalho}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
          </div>
        ) : (
          <div className="space-y-4">
            {preview?.assunto && (
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                  Assunto:
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">{preview.assunto}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                Corpo da Mensagem:
              </label>
              <div 
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: preview?.corpo }}
              />
            </div>

            {preview?.variaveis_usadas?.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">
                  Variáveis Processadas ({preview.variaveis_usadas.length}):
                </label>
                <div className="flex flex-wrap gap-2">
                  {preview.variaveis_usadas.map((v, idx) => (
                    <Badge key={idx} variant="secondary" className="font-mono text-xs">
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirm(preview?.corpo || '');
              onClose();
            }}
            disabled={isLoading}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Check className="w-4 h-4 mr-2" />
            Usar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}