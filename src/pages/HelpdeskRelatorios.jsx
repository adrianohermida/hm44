import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import RelatorioFiltros from '@/components/helpdesk/reports/RelatorioFiltros';
import RelatorioPreview from '@/components/helpdesk/reports/RelatorioPreview';
import RelatorioFiltrosSalvos from '@/components/helpdesk/reports/RelatorioFiltrosSalvos';
import ExportButton from '@/components/helpdesk/reports/ExportButton';
import { Loader2 } from 'lucide-react';

export default function HelpdeskRelatorios() {
  const [filtros, setFiltros] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  if (!escritorio || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Atendimento', url: createPageUrl('Helpdesk') },
        { label: 'Relatórios' }
      ]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Personalizados</h1>
          <p className="text-sm text-gray-600">Gere relatórios customizados com filtros salvos</p>
        </div>
        <ExportButton 
          filtros={filtros} 
          escritorioId={escritorio.id}
          userEmail={user.email}
        />
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          <RelatorioFiltrosSalvos 
            onSelectFiltro={setFiltros}
            escritorioId={escritorio.id}
            userEmail={user.email}
          />
          <RelatorioFiltros 
            filtros={filtros}
            onChange={setFiltros}
            escritorioId={escritorio.id}
            userEmail={user.email}
          />
        </div>

        <RelatorioPreview 
          filtros={filtros}
          escritorioId={escritorio.id}
        />
      </div>
    </div>
  );
}