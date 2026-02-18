import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Search } from 'lucide-react';
import ProcessoInfoRow from './ProcessoInfoRow';
import TooltipJuridico from '@/components/common/TooltipJuridico';
import { useIsMutating, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ConfirmarConsumoModal from './ConfirmarConsumoModal';

export default function ProcessoInfoCard({ processo }) {
  const isRefreshing = useIsMutating({ mutationKey: ['refresh-processo'] }) > 0;
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuscarCNJ = async () => {
    setLoading(true);
    
    try {
      const { data } = await base44.functions.invoke('syncProcessoDatajud', {
        processo_id: processo.id
      });

      if (data?.sucesso) {
        queryClient.invalidateQueries(['processo', processo.id]);
        toast.success('Dados atualizados via DataJud CNJ');
      } else {
        toast.error('Processo não encontrado no DataJud');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Card className="relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
            <p className="text-sm text-[var(--text-secondary)]">Atualizando...</p>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Informações do Processo</CardTitle>
          {processo.numero_cnj && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleBuscarCNJ}
              disabled={loading || isRefreshing}
              title="Buscar dados atualizados no CNJ (gratuito via DataJud)"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              Buscar no CNJ
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProcessoInfoRow label={<TooltipJuridico termo="comarca">Tribunal</TooltipJuridico>} value={processo.tribunal} />
        <ProcessoInfoRow label="Sistema" value={processo.sistema} />
        <ProcessoInfoRow label="Classe" value={processo.classe} />
        <ProcessoInfoRow label="Assunto" value={processo.assunto} />
        <ProcessoInfoRow label="Área" value={processo.area} />
        <ProcessoInfoRow label="Órgão Julgador" value={processo.orgao_julgador} />
        <ProcessoInfoRow label={<TooltipJuridico termo="instancia">Instância</TooltipJuridico>} value={processo.instancia || '-'} />
        <ProcessoInfoRow label="Data Distribuição" value={processo.data_distribuicao ? new Date(processo.data_distribuicao).toLocaleDateString() : '-'} />
        <ProcessoInfoRow label="Valor da Causa" value={processo.valor_causa} />
        {processo.observacoes && (
          <div className="pt-3 border-t border-[var(--border-primary)]">
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Observações</p>
            <p className="text-sm text-[var(--text-primary)]">{processo.observacoes}</p>
          </div>
        )}
      </CardContent>
    </Card>


    </>
  );
}