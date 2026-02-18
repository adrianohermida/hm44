import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, MoreVertical, RefreshCw, Sparkles, FileDown, Link2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import ProcessoStatusBadge from './ProcessoStatusBadge';

export default function ProcessoDetailHeader({ processo, onBack, onEdit, onApensar }) {
  const handleSolicitarAtualizacao = () => toast.info('Solicitando atualização via API...');
  const handleExportarPDF = () => toast.info('Exportando processo em PDF...');

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Voltar" className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg md:text-2xl font-bold text-[var(--text-primary)] truncate">
              {processo.numero_cnj}
            </h1>
            <ProcessoStatusBadge status={processo.status} />
          </div>
          {processo.titulo && (
            <p className="text-xs md:text-sm text-[var(--text-secondary)] truncate mt-1">{processo.titulo}</p>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSolicitarAtualizacao}>
            <RefreshCw className="w-4 h-4 mr-2" />Atualizar Andamento
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportarPDF}>
            <FileDown className="w-4 h-4 mr-2" />Exportar PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onApensar}>
            <Link2 className="w-4 h-4 mr-2" />Apensar Processo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}