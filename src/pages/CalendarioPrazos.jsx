import React from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';
import CalendarioVisualPrazos from '@/components/prazos/CalendarioVisualPrazos';

export default function CalendarioPrazos() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', url: createPageUrl('Dashboard') },
            { label: 'Prazos', url: createPageUrl('Prazos') },
            { label: 'Calendário' }
          ]} 
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Calendário de Prazos
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Visualize prazos por data no calendário
          </p>
        </div>

        <CalendarioVisualPrazos />
      </div>
    </div>
  );
}