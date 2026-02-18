import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Users, MapPin, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function ProcessoDetailsPanel({ processo }) {
  const navigate = useNavigate();

  if (!processo) return null;

  const statusColors = {
    ativo: 'bg-green-100 text-green-800',
    suspenso: 'bg-yellow-100 text-yellow-800',
    arquivado: 'bg-gray-100 text-gray-800'
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{processo.titulo || processo.numero_cnj}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{processo.numero_cnj}</p>
          <div className="flex gap-2 mt-3">
            <Badge className={statusColors[processo.status] || statusColors.ativo}>
              {processo.status}
            </Badge>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Informações</h3>
          
          {processo.classe && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Classe</p>
                <p className="text-sm text-[var(--text-primary)]">{processo.classe}</p>
              </div>
            </div>
          )}

          {processo.data_distribuicao && (
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Distribuição</p>
                <p className="text-sm text-[var(--text-primary)]">
                  {format(new Date(processo.data_distribuicao), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          )}

          {processo.orgao_julgador && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Órgão Julgador</p>
                <p className="text-sm text-[var(--text-primary)]">{processo.orgao_julgador}</p>
              </div>
            </div>
          )}

          {processo.polo_ativo && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Polo Ativo</p>
                <p className="text-sm text-[var(--text-primary)]">{processo.polo_ativo}</p>
              </div>
            </div>
          )}

          {processo.polo_passivo && (
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Polo Passivo</p>
                <p className="text-sm text-[var(--text-primary)]">{processo.polo_passivo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Ver Completo */}
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate(createPageUrl('ProcessoDetails') + `?id=${processo.id}`)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir Processo Completo
        </Button>
      </div>
    </ScrollArea>
  );
}