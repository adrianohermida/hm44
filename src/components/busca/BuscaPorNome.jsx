import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function BuscaPorNome({ onResultados }) {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!nome && !documento) return toast.error('Informe o nome ou CPF/CNPJ');
    setLoading(true);
    try {
      const payload = {};
      
      if (nome?.trim()) {
        payload.nome = nome.trim();
      }
      
      // Adicionar CPF ou CNPJ baseado no tamanho do documento
      if (documento) {
        const docLimpo = documento.replace(/\D/g, '');
        if (docLimpo.length === 11) {
          payload.cpf = docLimpo;
        } else if (docLimpo.length === 14) {
          payload.cnpj = docLimpo;
        } else if (docLimpo.length > 0) {
          toast.warning('CPF deve ter 11 dígitos ou CNPJ 14 dígitos');
          setLoading(false);
          return;
        }
      }
      
      const { data } = await base44.functions.invoke('buscarProcessosPorEnvolvido', payload);
      
      if (data.envolvido_encontrado) {
        toast.info(`Envolvido: ${data.envolvido_encontrado.nome} (${data.envolvido_encontrado.quantidade_processos} processos)`);
      }
      
      onResultados({ 
        processos: data.processos || [], 
        processos_salvos: data.processos_salvos || 0 
      });
      toast.success(`${data.processos_salvos || 0} processo(s) adicionado(s) | ${data.creditos_consumidos} créditos`);
    } catch (err) {
      toast.error(err.message || 'Erro na busca');
      onResultados({ processos: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Nome do Envolvido</Label>
        <Input 
          placeholder="Ex: João da Silva"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <Label>CPF/CNPJ (opcional)</Label>
        <Input 
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          Informe CPF (11 dígitos) ou CNPJ (14 dígitos). Recomendado combinar com nome.
        </p>
      </div>
      <Button onClick={buscar} disabled={loading} className="w-full">
        {loading ? 'Buscando...' : 'Buscar Processos'}
      </Button>
    </div>
  );
}