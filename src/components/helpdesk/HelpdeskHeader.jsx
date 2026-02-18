import React from 'react';
import { Headphones, Search, Settings, BarChart3, Menu, Plus, Mail, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import HelpdeskHeaderActions from './HelpdeskHeaderActions';

export default function HelpdeskHeader({ 
  sidebarCollapsed, 
  onToggleSidebar,
  escritorioId,
  selectedIds = [],
  onBulkActionsChange,
  onResolver,
  onExcluir
}) {
  return (
    <>
      {selectedIds.length > 0 && onBulkActionsChange && (
        <HelpdeskHeaderActions
          selectedCount={selectedIds.length}
          onAtribuir={() => onBulkActionsChange('atribuir')}
          onFechar={() => onBulkActionsChange('fechar')}
          onAtualizacaoMassa={() => onBulkActionsChange('atualizar_massa')}
          onMesclar={() => onBulkActionsChange('mesclar')}
          onEncaminhar={() => onBulkActionsChange('encaminhar')}
          onResolver={onResolver}
          onExcluir={onExcluir}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Atendimento</h1>
        </div>
        <div className="flex items-center gap-2">
        <Link to={createPageUrl('EnviarTicket')}>
          <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] gap-2 h-9">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Ticket</span>
          </Button>
        </Link>

        <Link to={createPageUrl('EnviarEmail')}>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <Mail className="w-4 h-4" />
            <span className="hidden lg:inline">Email</span>
          </Button>
        </Link>

        <Link to={createPageUrl('HelpdeskAnalytics')}>
          <Button variant="outline" size="sm" className="h-9 hidden lg:flex" aria-label="Ver analytics">
            <BarChart3 className="w-4 h-4" />
          </Button>
        </Link>
        <Link to={createPageUrl('HelpdeskRelatorios')}>
          <Button variant="outline" size="sm" className="h-9 hidden lg:flex" aria-label="Ver relatórios">
            <FileText className="w-4 h-4" />
          </Button>
        </Link>
        <Link to={createPageUrl('HelpdeskSettings')}>
          <Button variant="outline" size="sm" className="h-9 hidden lg:flex" aria-label="Abrir configurações">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
        </div>
      </div>
    </>
  );
}