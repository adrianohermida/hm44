import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import ProcessoResumo from './ProcessoResumo';
import ProcessoDetalhesExpandidos from './ProcessoDetalhesExpandidos';
import RepresentanteBadge from './RepresentanteBadge';
import ProcessoPartesPreview from './ProcessoPartesPreview';
import { extrairPartes } from './ProcessoPartesExtractor';
import MovimentacoesBadge from '../processos/mini/MovimentacoesBadge';
import AudienciasBadge from '../processos/mini/AudienciasBadge';
import ProcessoDetailsModal from '../processos/modals/ProcessoDetailsModal';

export default function ProcessoResultadoCard({ 
  processo, 
  selecionado, 
  onToggleSelecao 
}) {
  const [expandido, setExpandido] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const partes = processo.dados_completos_api && processo.oab_buscada
    ? extrairPartes(processo.dados_completos_api, processo.oab_buscada)
    : [];

  const totalMovimentacoes = processo.dados_completos_api?.quantidade_movimentacoes || 0;
  const totalAudiencias = processo.dados_completos_api?.fontes?.reduce(
    (acc, f) => acc + (f.audiencias?.length || 0), 0
  ) || 0;

  return (
    <>
    <Card className="border-[var(--border-primary)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={selecionado}
              onCheckedChange={() => onToggleSelecao(processo.numero_cnj)}
            />
            <FileText className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[var(--text-primary)]">{processo.numero_cnj}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge>{processo.fontes?.[0]?.sigla || 'N/A'}</Badge>
              {processo.fontes?.[0]?.grau_formatado && (
                <Badge variant="outline">{processo.fontes[0].grau_formatado}</Badge>
              )}
              {processo.fontes?.[0]?.status_predito && (
                <Badge variant={processo.fontes[0].status_predito === 'ATIVO' ? 'default' : 'secondary'}>
                  {processo.fontes[0].status_predito}
                </Badge>
              )}
              <RepresentanteBadge processo={processo} />
              <MovimentacoesBadge count={totalMovimentacoes} />
              <AudienciasBadge count={totalAudiencias} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setModalAberto(true)}
            className="flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProcessoResumo processo={processo} />
        {partes.length > 0 && <ProcessoPartesPreview partes={partes} />}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpandido(!expandido)}
          className="w-full"
        >
          {expandido ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          {expandido ? 'Ocultar detalhes' : 'Ver detalhes'}
        </Button>
        {expandido && <ProcessoDetalhesExpandidos numeroCnj={processo.numero_cnj} />}
      </CardContent>
    </Card>
    <ProcessoDetailsModal 
      processo={processo.dados_completos_api} 
      open={modalAberto} 
      onClose={() => setModalAberto(false)} 
    />
    </>
  );
}