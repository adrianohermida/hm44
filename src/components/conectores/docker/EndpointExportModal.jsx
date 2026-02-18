import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function EndpointExportModal({ endpoints, open, onClose }) {
  const jsonData = JSON.stringify(endpoints, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `endpoints-${Date.now()}.json`;
    a.click();
    toast.success('Arquivo baixado');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonData);
    toast.success('JSON copiado');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Exportar Endpoints ({endpoints.length})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Baixar JSON
            </Button>
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
          </div>
          <pre className="bg-[var(--bg-secondary)] p-4 rounded text-xs overflow-auto max-h-96">
            {jsonData}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}