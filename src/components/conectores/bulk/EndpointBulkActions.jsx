import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Link2, Database } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SecretSelector from './SecretSelector';

export default function EndpointBulkActions({ selectedIds, provedores, onClear }) {
  const [provedor, setProvedor] = useState('');
  const [versao, setVersao] = useState('');
  const [secret, setSecret] = useState('');
  const [pendingChanges, setPendingChanges] = useState(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const promises = selectedIds.map(id => base44.entities.EndpointAPI.delete(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints']);
      toast.success(`${selectedIds.length} endpoints deletados`);
      onClear();
      setProvedor('');
      setVersao('');
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const promises = selectedIds.map(id => base44.entities.EndpointAPI.update(id, data));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints']);
      toast.success(`✅ ${selectedIds.length} endpoints atualizados com sucesso`);
      setProvedor('');
      setVersao('');
      setSecret('');
      setPendingChanges(null);
      onClear();
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const handleApply = () => {
    if (pendingChanges) {
      const changesSummary = [];
      if (pendingChanges.provedor_id) changesSummary.push('provedor');
      if (pendingChanges.versao_api) changesSummary.push('versão');
      if (pendingChanges.api_key_config) changesSummary.push('secret');
      
      const confirmed = confirm(
        `Aplicar alterações em ${selectedIds.length} endpoints?\n\n` +
        `Mudanças: ${changesSummary.join(', ')}`
      );
      
      if (!confirmed) return;
      
      updateMutation.mutate(pendingChanges);
    }
  };

  const handleProvedorChange = (v) => {
    setProvedor(v);
    setPendingChanges({ ...pendingChanges, provedor_id: v });
  };

  const handleVersaoChange = (v) => {
    setVersao(v);
    setPendingChanges({ ...pendingChanges, versao_api: v });
  };

  const handleSecretChange = async (v) => {
    setSecret(v);
    
    if (v === 'none') {
      const confirmed = confirm(`Remover secret de ${selectedIds.length} endpoints?\n\nIsso deixará os endpoints sem autenticação configurada.`);
      if (!confirmed) return;
    }
    
    const updates = {};
    if (v !== 'none') {
      const provedorSelecionado = provedores.find(p => p.id === provedor);
      if (provedorSelecionado) {
        updates.api_key_config = {
          ...provedorSelecionado.api_key_config,
          secret_name: v
        };
      } else {
        updates.api_key_config = {
          secret_name: v,
          header_name: 'Authorization',
          prefix: 'Bearer'
        };
      }
    } else {
      updates.api_key_config = null;
    }
    
    setPendingChanges({ ...pendingChanges, ...updates });
    toast.success(`Secret ${v === 'none' ? 'removido' : 'selecionado'}: aplicar para confirmar`);
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-[var(--bg-tertiary)] rounded-lg border items-center">
      <Select value={provedor} onValueChange={handleProvedorChange}>
        <SelectTrigger className="w-48">
          <Link2 className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Associar provedor" />
        </SelectTrigger>
        <SelectContent>
          {provedores.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={versao} onValueChange={handleVersaoChange}>
        <SelectTrigger className="w-36">
          <Database className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Versão API" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="V1">V1</SelectItem>
          <SelectItem value="V2">V2</SelectItem>
        </SelectContent>
      </Select>
      <SecretSelector value={secret} onChange={handleSecretChange} />
      {pendingChanges && (
        <Button size="sm" onClick={handleApply} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Aplicando...' : 'Aplicar'}
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
        <Trash2 className="w-4 h-4 mr-1" />Excluir ({selectedIds.length})
      </Button>
    </div>
  );
}