import React from 'react';
import ImportarTodosDoLog from './ImportarTodosDoLog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function APILogModal({ log, open, onClose }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(log?.resposta_completa, null, 2));
    toast.success('JSON copiado!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Resposta Completa da API</DialogTitle>
          <div className="flex gap-2 mt-2">
            <ImportarTodosDoLog log={log} onComplete={onClose} />
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar JSON
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <pre className="p-4 bg-[var(--brand-bg-tertiary)] rounded text-xs overflow-auto">
            {JSON.stringify(log?.resposta_completa, null, 2)}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}