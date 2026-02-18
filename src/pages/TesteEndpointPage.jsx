import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { History, BarChart3 } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import ModuloNav from '@/components/conectores/ModuloNav';
import EndpointSelector from '@/components/conectores/teste/EndpointSelector';
import TestePainel from '@/components/conectores/teste/TestePainel';
import ResultadoPainel from '@/components/conectores/teste/ResultadoPainel';
import useURLParams from '@/components/conectores/navigation/URLParamsHandler';
import useTestePainel from '@/components/conectores/hooks/useTestePainel';
import useResponsive from '@/components/hooks/useResponsive';

export default function TesteEndpointPage() {
  const { isMobile } = useResponsive();
  const [selectedId, setSelectedId] = useState(null);
  
  useURLParams('endpoint', setSelectedId);
  
  const { endpoint, endpoints, provedores, testes, alertas, resultado, setResultado } = useTestePainel(selectedId);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[
        { label: 'Conectores & APIs', url: createPageUrl('AdminProvedores') },
        { label: 'Testar APIs' }
      ]} />
      <ModuloNav />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {isMobile ? 'Teste de APIs' : 'Teste de Endpoints API'}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <Link to={createPageUrl("AdminTestes")}>
            <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]">
              <History className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Histórico</span>
            </Button>
          </Link>
          <Link to={createPageUrl("AnalyticsConsumo")}>
            <Button variant="outline" size="sm" className="min-h-[44px] min-w-[44px]">
              <BarChart3 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <EndpointSelector 
            endpoints={endpoints}
            provedores={provedores}
            selectedId={selectedId} 
            onSelect={setSelectedId} 
          />
        </div>

        {endpoint && (
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <TestePainel 
              endpoint={endpoint} 
              alertas={alertas}
              onResult={setResultado}
            />
            <ResultadoPainel 
              resultado={resultado} 
              endpoint={endpoint} 
              testes={testes} 
            />
          </div>
        )}
      </div>
    </div>
  );
}