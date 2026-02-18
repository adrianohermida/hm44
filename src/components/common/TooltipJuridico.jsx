import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

const TERMOS_JURIDICOS = {
  'CNJ': 'Conselho Nacional de Justiça - Numeração única nacional para processos judiciais',
  'PJe': 'Processo Judicial Eletrônico - Sistema de tramitação processual digital',
  'Polo Ativo': 'Parte que propôs a ação judicial (autor/requerente)',
  'Polo Passivo': 'Parte contra quem a ação foi proposta (réu/requerido)',
  'Apenso': 'Processo que tramita junto com outro processo principal por conexão',
  'Instância': 'Grau de jurisdição onde o processo está tramitando',
  'Classe Processual': 'Tipo/natureza do procedimento judicial',
  'Valor da Causa': 'Valor econômico atribuído ao pedido judicial',
  'Distribuição': 'Sorteio automático que determina o juiz responsável',
  'Órgão Julgador': 'Vara, Câmara ou Turma responsável pelo julgamento',
  'Publicação': 'Comunicação oficial de atos processuais no Diário Oficial',
  'Intimação': 'Comunicação formal para ciência de decisões ou prazos',
  'Movimentação': 'Registro de eventos e atos no andamento processual'
};

export default function TooltipJuridico({ termo, children, className }) {
  const definicao = TERMOS_JURIDICOS[termo];
  
  if (!definicao) return children || <span className={className}>{termo}</span>;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 cursor-help border-b border-dashed border-[var(--text-tertiary)] ${className}`}>
            {children || termo}
            <HelpCircle className="w-3 h-3 text-[var(--text-tertiary)]" aria-hidden="true" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{definicao}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}