import React from 'react';
import { Calendar, Users, Heart, FileText } from 'lucide-react';
import ClienteStatusBadge from '../ClienteStatusBadge';
import ProfissaoNacionalidade from './ProfissaoNacionalidade';

export default function DadosBasicosPF({ cliente }) {
  const estadoCivilMap = {
    solteiro: 'Solteiro(a)',
    casado: 'Casado(a)',
    divorciado: 'Divorciado(a)',
    viuvo: 'Viúvo(a)',
    uniao_estavel: 'União Estável'
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">Status</span>
        <ClienteStatusBadge status={cliente.status} />
      </div>
      {cliente.cpf && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">CPF</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">{cliente.cpf}</span>
        </div>
      )}

      {cliente.filiacao?.nome_mae && (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-primary)]">Mãe: {cliente.filiacao.nome_mae}</span>
        </div>
      )}
      {cliente.filiacao?.nome_pai && (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-primary)]">Pai: {cliente.filiacao.nome_pai}</span>
        </div>
      )}
      {cliente.rg && (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--text-tertiary)]" />
          <span className="text-sm text-[var(--text-primary)]">RG: {cliente.rg}</span>
        </div>
      )}
      <ProfissaoNacionalidade cliente={cliente} />
    </div>
  );
}