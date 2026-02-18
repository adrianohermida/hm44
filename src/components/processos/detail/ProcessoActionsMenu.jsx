import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, RefreshCw, FileDown, Link2, Eye, EyeOff, BarChart3, MessageSquare } from 'lucide-react';

export default function ProcessoActionsMenu({ actions = {} }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu de ações">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={actions?.onEdit}>
          <Edit className="w-4 h-4 mr-2" />Editar Processo (E)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={actions?.onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />Atualizar (R)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={actions?.onExport}>
          <FileDown className="w-4 h-4 mr-2" />Exportar PDF (P)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={actions?.onToggleMonitor}>
          {actions?.monitored ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          Monitor {actions?.monitored ? 'OFF' : 'ON'} (M)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={actions?.onOpenAnalytics}>
          <BarChart3 className="w-4 h-4 mr-2" />Analytics
        </DropdownMenuItem>
        <DropdownMenuItem onClick={actions?.onApensar}>
          <Link2 className="w-4 h-4 mr-2" />Apensar Processo
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={actions?.onCriarTicket}>
          <MessageSquare className="w-4 h-4 mr-2" />Criar Ticket
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}