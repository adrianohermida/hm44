import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import EndpointFormBasic from './forms/EndpointFormBasic';
import EndpointFormPath from './forms/EndpointFormPath';
import EndpointFormParams from './forms/EndpointFormParams';
import EndpointFormActions from './forms/EndpointFormActions';
import useEndpointOperations from './hooks/useEndpointOperations';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function EndpointFormModalContent({ endpoint, onClose }) {
  // Normalizar form inicial
  const initialForm = endpoint ? {
    ...endpoint,
    parametros_obrigatorios: endpoint.parametros?.filter(p => p.obrigatorio) || [],
    parametros_opcionais: endpoint.parametros?.filter(p => !p.obrigatorio) || []
  } : {
    nome: '',
    provedor_id: '',
    versao_api: 'V2',
    metodo: 'GET',
    path: '',
    descricao: '',
    categoria: '',
    parametros_obrigatorios: [],
    parametros_opcionais: [],
    creditos_consumidos: 0,
    ativo: true,
    requer_autenticacao: true,
    tags: []
  };

  const [form, setForm] = useState(initialForm);
  
  const { save, saving } = useEndpointOperations();

  const handleSave = () => {
    if (!form.nome?.trim()) {
      toast.error('Nome do endpoint é obrigatório');
      return;
    }
    if (!form.provedor_id) {
      toast.error('Provedor é obrigatório');
      return;
    }
    
    console.log('💾 EndpointFormModal.handleSave:', {
      endpoint_id: endpoint?.id,
      form_nome: form.nome,
      form_versao: form.versao_api,
      form_path: form.path,
      form_params_obr: form.parametros_obrigatorios,
      form_params_opc: form.parametros_opcionais
    });
    
    save(form);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{endpoint ? 'Editar' : 'Novo'} Endpoint</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <EndpointFormBasic form={form} onChange={setForm} />
          <EndpointFormPath form={form} onChange={setForm} />
          <EndpointFormParams form={form} onChange={setForm} />
          <EndpointFormActions 
            onSave={handleSave} 
            onCancel={onClose} 
            loading={saving} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EndpointFormModal(props) {
  return (
    <ErrorBoundary>
      <EndpointFormModalContent {...props} />
    </ErrorBoundary>
  );
}