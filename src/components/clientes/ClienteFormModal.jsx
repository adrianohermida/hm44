import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClienteFormPF from './ClienteFormPF';
import ClienteFormPJ from './ClienteFormPJ';

export default function ClienteFormModal({ open, onClose, onSubmit, onSave, cliente = null, escritorioId, tipoPessoa: tipoPessoaInicial }) {
  const handleSubmit = (data) => {
    if (onSubmit) onSubmit(data);
    if (onSave) onSave(data);
  };
  const [tipoPessoa, setTipoPessoa] = useState(
    tipoPessoaInicial === 'pf' ? 'fisica' : 
    tipoPessoaInicial === 'pj' ? 'juridica' :
    cliente?.tipo_pessoa === 'juridica' ? 'juridica' : 'fisica'
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={tipoPessoa} onValueChange={setTipoPessoa}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="fisica">Pessoa Física</TabsTrigger>
            <TabsTrigger value="juridica">Pessoa Jurídica</TabsTrigger>
          </TabsList>
          <TabsContent value="fisica">
            <ClienteFormPF 
              cliente={cliente} 
              onSubmit={handleSubmit} 
              onCancel={onClose}
              escritorioId={escritorioId}
            />
          </TabsContent>
          <TabsContent value="juridica">
            <ClienteFormPJ 
              cliente={cliente} 
              onSubmit={handleSubmit} 
              onCancel={onClose}
              escritorioId={escritorioId}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}