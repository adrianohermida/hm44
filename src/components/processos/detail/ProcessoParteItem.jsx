import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowLeftRight, Briefcase, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import BuscarNoTribunalButton from './BuscarNoTribunalButton';

export default function ProcessoParteItem({ 
  parte, 
  onEdit, 
  onDelete, 
  onChangePolo,
  onRemoverAdvogado,
  destacar = false,
  processoId
}) {
  const navigate = useNavigate();
  const hasActions = onEdit || onDelete || onChangePolo;
  const temClienteCadastrado = parte.e_cliente_escritorio && parte.cliente_id;

  return (
    <div className={`p-3 rounded-lg ${
      destacar 
        ? 'bg-[var(--brand-primary-50)] border-2 border-[var(--brand-primary)]' 
        : 'bg-[var(--bg-secondary)]'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[var(--text-primary)]">{parte.nome}</p>
            {temClienteCadastrado && (
              <Badge 
                className="text-xs bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${parte.cliente_id}&fromProcesso=${processoId}`)}
              >
                Cliente
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {parte.qualificacao && (
              <Badge variant="outline" className="text-xs">{parte.qualificacao}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {parte.dados_completos_api?.quantidade_processos > 1 && (
            <BuscarNoTribunalButton
              nome={parte.nome}
              cpf_cnpj={parte.cpf_cnpj}
              escritorio_id={parte.escritorio_id}
              quantidade_processos={parte.dados_completos_api.quantidade_processos}
              compact
            />
          )}
          {hasActions && (
            <>
              {onEdit && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(parte)} aria-label="Editar parte">
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              {onChangePolo && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onChangePolo(parte)} aria-label="Mudar polo">
                  <ArrowLeftRight className="w-3 h-3" />
                </Button>
              )}
              {onDelete && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDelete(parte.id)} aria-label="Excluir parte">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-1">
        {parte.cpf_cnpj && (
          <Badge variant="outline" className="text-xs">
            {parte.tipo_pessoa === 'juridica' ? 'CNPJ' : 'CPF'}: {parte.cpf_cnpj}
          </Badge>
        )}
        {parte.dados_completos_api?.quantidade_processos && (
          <Badge variant="secondary" className="text-xs">
            {parte.dados_completos_api.quantidade_processos} processos
          </Badge>
        )}
      </div>

      {parte.advogados?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--border-primary)]">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Advogados:
          </p>
          <div className="space-y-1.5">
            {parte.advogados.map((adv, i) => (
              <div key={i} className="flex items-start justify-between gap-2 text-xs group">
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">{adv.nome}</p>
                  {adv.oabs?.length > 0 && (
                    <p className="text-[var(--text-tertiary)]">
                      OAB {adv.oabs.map(o => `${o.numero}/${o.uf}`).join(', ')}
                    </p>
                  )}
                  {adv.quantidade_processos && (
                    <p className="text-[var(--text-tertiary)]">
                      {adv.quantidade_processos} processos
                    </p>
                  )}
                </div>
                {onEdit && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoverAdvogado?.(parte, i)}
                    aria-label="Remover advogado"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}