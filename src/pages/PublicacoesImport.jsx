import React from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ImportadorPublicacoes from '@/components/settings/ImportadorPublicacoes';
import { createPageUrl } from '@/utils';

export default function PublicacoesImport() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb 
          items={[
            { label: 'Configurações', url: createPageUrl('Configuracoes') },
            { label: 'Publicações' }
          ]} 
        />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Importar Publicações
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Importe publicações de processos via arquivo CSV
          </p>
        </div>

        <ImportadorPublicacoes />
      </div>
    </div>
  );
}