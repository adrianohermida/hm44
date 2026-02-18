import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Upload } from 'lucide-react';
import ProcessoManualForm from './ProcessoManualForm';
import ImportadorLoteOtimizado from './import/ImportadorLoteOtimizado';
import BuscaTribunalTab from './busca/BuscaTribunalTab';

export default function ProcessoCreateModal({ open, onClose, onSubmit, onSuccess }) {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Novo Processo</DialogTitle>
          <DialogDescription>
            {activeTab === 'manual' && 'Cadastre um processo manualmente'}
            {activeTab === 'buscar' && 'Busque processos nos tribunais'}
            {activeTab === 'importar' && 'Importe processos em lote via CSV/Excel'}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual" className="gap-2">
              <FileText className="w-4 h-4" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="buscar" className="gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </TabsTrigger>
            <TabsTrigger value="importar" className="gap-2">
              <Upload className="w-4 h-4" />
              Importar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <ProcessoManualForm onSubmit={onSubmit} onCancel={onClose} />
          </TabsContent>
          <TabsContent value="buscar" className="p-0">
            <BuscaTribunalTab 
              onClose={() => {
                onSuccess?.();
                onClose();
              }}
              onSuccess={() => {
                onSuccess?.();
                onClose();
              }}
            />
          </TabsContent>
          <TabsContent value="importar" className="p-0">
            <ImportadorLoteOtimizado 
              onClose={onClose}
              onSuccess={() => {
                onSuccess?.();
                onClose();
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}