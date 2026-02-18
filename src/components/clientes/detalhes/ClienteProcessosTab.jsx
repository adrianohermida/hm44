import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FileText, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BuscarNoTribunalButton from '@/components/processos/detail/BuscarNoTribunalButton';

function ProcessoItem({ processo }) {
  const navigate = useNavigate();

  const statusColor = {
    ativo: 'bg-green-100 text-green-800',
    suspenso: 'bg-yellow-100 text-yellow-800',
    arquivado: 'bg-gray-100 text-gray-800'
  }[processo.status || 'ativo'];

  return (
    <div className="flex items-start gap-3 p-4 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <div className="flex-shrink-0">
        <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <button
              onClick={() => navigate(`${createPageUrl('ProcessoDetails')}?id=${processo.id}`)}
              className="font-medium text-[var(--text-primary)] hover:text-[var(--brand-primary)] text-left line-clamp-1"
            >
              {processo.titulo || processo.numero_cnj}
            </button>
            <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
              <span>{processo.numero_cnj}</span>
              {processo.tribunal && (
                <>
                  <span>•</span>
                  <span>{processo.tribunal}</span>
                </>
              )}
            </div>
          </div>
          
          <Badge className={statusColor}>
            {processo.status || 'Ativo'}
          </Badge>
        </div>

        {processo.assunto && (
          <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
            <strong>Assunto:</strong> {processo.assunto}
          </p>
        )}

        {processo.data_distribuicao && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] mt-2">
            <Calendar className="w-3 h-3" />
            <span>Distribuído em {new Date(processo.data_distribuicao).toLocaleDateString('pt-BR')}</span>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`${createPageUrl('ProcessoDetails')}?id=${processo.id}`)}
          className="mt-3"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
}

export default function ClienteProcessosTab({ clienteId }) {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list().then(d => d[0])
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn: () => base44.entities.Cliente.filter({ id: clienteId }).then(d => d[0]),
    enabled: !!clienteId
  });

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos-cliente', clienteId, escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      
      // Buscar direto por cliente_id (mais rápido)
      const processosDiretos = await base44.entities.Processo.filter({ 
        cliente_id: clienteId,
        escritorio_id: escritorio.id
      }, '-created_date', 100);

      // Se não tem processos diretos, tentar via ProcessoParte
      if (processosDiretos.length === 0) {
        const partes = await base44.entities.ProcessoParte.filter({ 
          cliente_id: clienteId,
          escritorio_id: escritorio.id
        }, undefined, 100);
        
        if (partes.length === 0) return [];
        
        const processoIds = [...new Set(partes.map(p => p.processo_id))].slice(0, 50);
        const procs = await Promise.all(
          processoIds.map(id => base44.entities.Processo.filter({ id }).then(r => r[0]))
        );
        
        return procs.filter(Boolean);
      }

      return processosDiretos;
    },
    enabled: !!clienteId && !!escritorio?.id,
    staleTime: 2 * 60 * 1000
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (processos.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--text-secondary)]">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">Nenhum processo cadastrado</p>
        <p className="text-sm mt-1 mb-4">Use o botão "Novo Processo" para começar</p>
        {cliente && cliente.cpf_cnpj && (
          <div className="flex justify-center">
            <BuscarNoTribunalButton
              nome={cliente.nome_completo}
              cpf_cnpj={cliente.cpf_cnpj}
              escritorio_id={escritorio?.id}
              quantidade_processos={1}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cliente && cliente.cpf_cnpj && (
        <div className="flex justify-end mb-4">
          <BuscarNoTribunalButton
            nome={cliente.nome_completo}
            cpf_cnpj={cliente.cpf_cnpj}
            escritorio_id={escritorio?.id}
            quantidade_processos={1}
          />
        </div>
      )}
      {processos.map(processo => (
        <ProcessoItem key={processo.id} processo={processo} />
      ))}
    </div>
  );
}