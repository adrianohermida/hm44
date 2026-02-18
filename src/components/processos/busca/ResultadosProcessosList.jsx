import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQueryClient } from '@tanstack/react-query';
import { useEscritorio } from '@/components/hooks/useEscritorio';
import { criarJobImportacao, iniciarProcessamento } from '../import/ImportacaoService';
import { formatarCNJDisplay } from '../import/parsers/cnjParser';
import JobProgressMonitor from '../import/JobProgressMonitor';
import { toast } from 'sonner';
import { Download, Loader2 } from 'lucide-react';

export default function ResultadosProcessosList({ 
  processos, 
  selecionados, 
  onToggleSelecao, 
  onToggleTodos,
  processosSelecionados,
  onComplete 
}) {
  const [jobId, setJobId] = useState(null);
  const { data: escritorio } = useEscritorio();
  const queryClient = useQueryClient();

  const handleConcluir = () => {
    queryClient.invalidateQueries(['processos']);
    onComplete?.();
  };

  const handleJobError = (job) => {
    toast.error(`Falha na importação: ${job.erro_mensagem || 'Erro desconhecido'}`);
    setJobId(null);
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--text-secondary)]">
          {processos.length} processo(s) já adicionado(s) ao sistema
        </div>
        <Button 
          onClick={handleConcluir}
          className="bg-[var(--brand-primary)]"
        >
          Concluir
        </Button>
      </div>

      {processos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p className="text-[var(--text-secondary)] font-medium mb-1">Nenhum processo encontrado</p>
          <p className="text-sm text-[var(--text-tertiary)]">Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {processos.map((processo, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {processo.titulo || processo.polo_ativo}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {formatarCNJDisplay(processo.numero_cnj)}
                  </Badge>
                  {processo.tribunal && (
                    <Badge className="text-xs">{processo.tribunal}</Badge>
                  )}
                  {processo.salvo && (
                    <Badge className="text-xs bg-green-100 text-green-800">✓ Salvo</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        </div>
        )}
        </div>
        );
        }