import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { STALE_TIMES } from '@/components/utils/queryConfig';

export default function useEndpointOperations() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (endpointData) => {
      // Validações
      if (!endpointData.nome?.trim()) {
        throw new Error('Nome do endpoint é obrigatório');
      }
      if (!endpointData.provedor_id) {
        throw new Error('Provedor é obrigatório');
      }

      // Normalizar parametros com TODOS os campos
      const parametros = [
        ...(endpointData.parametros_obrigatorios || []).map(p => ({
          nome: p.nome,
          tipo: p.tipo || 'string',
          descricao: p.descricao || '',
          exemplo: p.exemplo || '',
          obrigatorio: true,
          localizacao: p.localizacao || 'query',
          opcoes_validas: p.opcoes_validas || [],
          valor_padrao: p.valor_padrao || null
        })),
        ...(endpointData.parametros_opcionais || []).map(p => ({
          nome: p.nome,
          tipo: p.tipo || 'string',
          descricao: p.descricao || '',
          exemplo: p.exemplo || '',
          obrigatorio: false,
          localizacao: p.localizacao || 'query',
          opcoes_validas: p.opcoes_validas || [],
          valor_padrao: p.valor_padrao || null
        }))
      ].filter(p => p.nome); // Remove parâmetros sem nome

      // Payload limpo SEM campos deprecated
      const payload = {
        provedor_id: endpointData.provedor_id,
        escritorio_id: endpointData.escritorio_id,
        versao_api: endpointData.versao_api || 'V2',
        nome: endpointData.nome.trim(),
        descricao: endpointData.descricao || '',
        categoria: endpointData.categoria || '',
        metodo: endpointData.metodo || 'GET',
        path: endpointData.path || '',
        requer_autenticacao: endpointData.requer_autenticacao ?? true,
        parametros: parametros, // APENAS este campo
        schema_resposta: endpointData.schema_resposta || {},
        exemplo_payload: endpointData.exemplo_payload || {},
        exemplo_resposta: endpointData.exemplo_resposta || {},
        documentacao_url: endpointData.documentacao_url || '',
        creditos_consumidos: endpointData.creditos_consumidos || 0,
        ativo: endpointData.ativo ?? true,
        tags: endpointData.tags || []
      };

      // CRÍTICO: NO UPDATE, nunca enviar campos deprecated
      if (editing?.id) {
        return await base44.entities.EndpointAPI.update(editing.id, payload);
      }
      
      // CREATE
      return await base44.entities.EndpointAPI.create(payload);
    },
    onMutate: async (newEndpoint) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries(['endpoints']);
      
      // Snapshot
      const previousEndpoints = queryClient.getQueryData(['endpoints']);
      
      // Atualização otimista apenas para UPDATE
      if (editing?.id) {
        queryClient.setQueryData(['endpoints'], (old = []) => 
          old.map(e => e.id === editing.id ? { ...e, ...newEndpoint } : e)
        );
      }
      
      return { previousEndpoints };
    },
    onSuccess: (data) => {
      // Invalidar queries
      queryClient.invalidateQueries(['endpoints']);
      queryClient.invalidateQueries(['test-profiles']);
      queryClient.invalidateQueries(['test-history']);
      
      toast.success(editing ? '✅ Endpoint atualizado' : '✅ Endpoint criado');
      closeForm();
    },
    onError: (error, vars, context) => {
      // Reverter
      if (context?.previousEndpoints) {
        queryClient.setQueryData(['endpoints'], context.previousEndpoints);
      }
      toast.error(error.message || 'Erro ao salvar endpoint');
    }
  });

  const openForm = (endpoint = null) => {
    console.log('🔧 openForm:', endpoint?.id, endpoint?.nome);
    setEditing(endpoint);
    setShowForm(true);
  };

  const closeForm = () => {
    console.log('🔒 closeForm');
    setShowForm(false);
    setTimeout(() => setEditing(null), 100);
  };

  return {
    showForm,
    editing,
    openForm,
    closeForm,
    save: saveMutation.mutate,
    saving: saveMutation.isPending
  };
}