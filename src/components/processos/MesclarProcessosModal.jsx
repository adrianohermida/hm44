import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatarCNJ } from '@/components/utils/cnjUtils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MesclarProcessosModal({ open, onClose, processos, onConfirm }) {
  const [principal, setPrincipal] = useState(processos[0]?.id);

  if (!processos || processos.length < 2) return null;

  const handleMesclar = () => {
    onConfirm(principal, processos.filter(p => p.id !== principal).map(p => p.id));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mesclar Processos</DialogTitle>
          <DialogDescription>
            Selecione o processo principal. Os dados dos outros serão mesclados e os duplicados removidos.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-sm">
            Esta ação não pode ser desfeita. Todos os documentos, movimentações e vínculos serão transferidos para o processo principal.
          </AlertDescription>
        </Alert>

        <RadioGroup value={principal} onValueChange={setPrincipal}>
          <div className="space-y-3">
            {processos.map(p => (
              <div key={p.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <RadioGroupItem value={p.id} id={p.id} className="mt-1" />
                <Label htmlFor={p.id} className="flex-1 cursor-pointer">
                  <div className="space-y-2">
                    <div className="font-medium">{formatarCNJ(p.numero_cnj)}</div>
                    <div className="flex gap-2 flex-wrap text-sm text-[var(--text-secondary)]">
                      {p.tribunal && <Badge variant="outline">{p.tribunal}</Badge>}
                      {p.classe && <Badge variant="outline">{p.classe}</Badge>}
                      {p.status && <Badge variant="outline">{p.status}</Badge>}
                      <Badge variant="outline">
                        Criado em {new Date(p.created_date).toLocaleDateString()}
                      </Badge>
                    </div>
                    {p.titulo && (
                      <div className="text-xs text-[var(--text-tertiary)]">{p.titulo}</div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleMesclar}>Mesclar {processos.length} processos</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}