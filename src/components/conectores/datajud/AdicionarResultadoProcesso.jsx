import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdicionarResultadoProcesso({ dadosDatajud, escritorioId }) {
  const [titulo, setTitulo] = useState('');
  const queryClient = useQueryClient();

  const criarMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.Processo.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['processos']);
      toast.success('Processo criado com sucesso');
      setTitulo('');
    }
  });

  const handleCriar = () => {
    if (!titulo.trim()) {
      toast.error('Digite um título para o processo');
      return;
    }

    const hit = dadosDatajud?.hits?.hits?.[0]?._source;
    if (!hit) {
      toast.error('Dados inválidos');
      return;
    }

    criarMutation.mutate({
      escritorio_id: escritorioId,
      numero_cnj: hit.numeroProcesso,
      titulo: titulo,
      tribunal: hit.tribunal,
      classe: hit.classe?.nome,
      assunto: hit.assuntos?.[0]?.[0]?.nome || hit.assuntos?.[0]?.nome,
      orgao_julgador: hit.orgaoJulgador?.nome,
      data_distribuicao: hit.dataAjuizamento?.split('T')?.[0],
      grau_instancia: hit.grau === 'G1' ? 1 : 2,
      sistema: hit.sistema?.nome,
      datajud_raw: hit,
      sync_status: 'synced',
      ultima_sincronizacao_datajud: new Date().toISOString()
    });
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-sm text-green-900">
        ✅ Adicionar ao Sistema
      </h4>
      
      <div>
        <Label className="text-xs">Título do Processo</Label>
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Ação Civil Pública - Meio Ambiente"
          className="text-xs"
        />
      </div>

      <Button
        onClick={handleCriar}
        disabled={criarMutation.isPending || !titulo.trim()}
        className="w-full bg-green-600 hover:bg-green-700"
        size="sm"
      >
        {criarMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Criando...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Criar Processo
          </>
        )}
      </Button>
    </div>
  );
}