import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MovimentacoesList from '../lists/MovimentacoesList';
import AudienciasList from '../lists/AudienciasList';

export default function ProcessoDetailsModal({ processo, open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{processo?.numero_cnj}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="movimentacoes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movimentacoes">
              Movimentações ({processo?.movimentacoes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="audiencias">
              Audiências ({processo?.audiencias?.length || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="movimentacoes">
            <MovimentacoesList movimentacoes={processo?.movimentacoes || []} />
          </TabsContent>
          <TabsContent value="audiencias">
            <AudienciasList audiencias={processo?.audiencias || []} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}