import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProcessoInfoItem from './ProcessoInfoItem';
import TooltipJuridico from '@/components/common/TooltipJuridico';
import { Building2, FileText, Calendar, DollarSign } from 'lucide-react';

export default function ProcessoInfoGrid({ processo }) {
  if (!processo) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Processo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <ProcessoInfoItem 
          label={<TooltipJuridico termo="comarca">Tribunal</TooltipJuridico>} 
          value={processo.tribunal} 
          icon={Building2}
        />
        <ProcessoInfoItem label="Sistema" value={processo.sistema} />
        <ProcessoInfoItem label="Classe" value={processo.classe} icon={FileText} />
        <ProcessoInfoItem label="Assunto" value={processo.assunto} />
        <ProcessoInfoItem label="Área" value={processo.area} />
        <ProcessoInfoItem label="Órgão Julgador" value={processo.orgao_julgador} />
        <ProcessoInfoItem 
          label={<TooltipJuridico termo="instancia">Instância</TooltipJuridico>} 
          value={processo.instancia} 
        />
        <ProcessoInfoItem 
          label="Data Distribuição" 
          value={processo.data_distribuicao ? new Date(processo.data_distribuicao).toLocaleDateString('pt-BR') : null}
          icon={Calendar}
        />
        <ProcessoInfoItem 
          label="Valor da Causa" 
          value={processo.valor_causa} 
          icon={DollarSign}
        />
        
        {/* Informações Complementares */}
        {(processo.situacao_processo || processo.grau_instancia || processo.estado_origem_nome || 
          (processo.dados_completos_api?.informacoes_complementares && 
           processo.dados_completos_api.informacoes_complementares.length > 0)) && (
          <div className="pt-3 mt-3 border-t border-[var(--border-primary)]">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Informações Complementares</p>
            <div className="space-y-1">
              {processo.situacao_processo && (
                <ProcessoInfoItem label="Situação" value={processo.situacao_processo} />
              )}
              {processo.grau_instancia && (
                <ProcessoInfoItem label="Grau" value={`${processo.grau_instancia}º Grau`} />
              )}
              {processo.estado_origem_nome && (
                <ProcessoInfoItem 
                  label="Estado Origem" 
                  value={`${processo.estado_origem_nome}${processo.estado_origem_sigla ? ` (${processo.estado_origem_sigla})` : ''}`} 
                />
              )}
              {processo.ano_inicio && (
                <ProcessoInfoItem label="Ano Início" value={processo.ano_inicio} />
              )}
              {processo.dados_completos_api?.informacoes_complementares?.map((info, idx) => (
                <ProcessoInfoItem 
                  key={idx}
                  label={info.tipo} 
                  value={info.valor} 
                />
              ))}
            </div>
          </div>
        )}
        
        {processo.observacoes && (
          <div className="pt-3 mt-3 border-t border-[var(--border-primary)]">
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">Observações</p>
            <p className="text-sm text-[var(--text-primary)]">{processo.observacoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}