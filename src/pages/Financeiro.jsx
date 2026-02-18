import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { useUXTracker } from '@/components/hooks/useUXTracker';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FinanceiroOverview from '@/components/financeiro/FinanceiroOverview';
import ReceitasChart from '@/components/financeiro/charts/ReceitasChart';
import FluxoCaixaChart from '@/components/financeiro/charts/FluxoCaixaChart';
import { DollarSign } from 'lucide-react';
import { reportCustomError } from '@/components/debug/ErrorLogger';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';

export default function Financeiro() {
  usePerformanceTracker('Financeiro');
  useUXTracker();
  
  const [honorarios, setHonorarios] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      if (userData.role === 'admin') {
        const data = await base44.entities.Honorario.list('-updated_date', 50);
        setHonorarios(data);
      } else {
        const data = await base44.entities.Honorario.filter({ cliente_email: userData.email }, '-updated_date');
        setHonorarios(data);
      }
    } catch (error) {
      reportCustomError('Erro ao carregar dados financeiros', 'ENTITIES', error.stack, { userRole: user?.role });
    }
  };

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Financeiro' }]} />
        
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-primary)]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            {user?.role === 'admin' ? 'Financeiro' : 'Minhas Faturas'}
          </h1>
        </div>

        <FinanceiroOverview honorarios={honorarios} isAdmin={user?.role === 'admin'} />
        
        {user?.role === 'admin' && (
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="bg-[var(--bg-elevated)] rounded-xl p-4 md:p-6 border border-[var(--border-primary)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Receitas por Categoria</h2>
              <ReceitasChart data={[
                { categoria: 'Honorários', valor: honorarios.filter(h => h.status === 'pago').reduce((sum, h) => sum + h.valor_total, 0) },
                { categoria: 'Consultas', valor: honorarios.filter(h => h.tipo === 'consulta').reduce((sum, h) => sum + h.valor_total, 0) },
                { categoria: 'Outros', valor: honorarios.filter(h => h.tipo === 'outro').reduce((sum, h) => sum + h.valor_total, 0) }
              ]} />
            </div>
            <div className="bg-[var(--bg-elevated)] rounded-xl p-4 md:p-6 border border-[var(--border-primary)]">
              <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-3 md:mb-4">Fluxo de Caixa</h2>
              <FluxoCaixaChart data={[
                { mes: 'Jan', entradas: 45000, saidas: 32000 },
                { mes: 'Fev', entradas: 52000, saidas: 35000 },
                { mes: 'Mar', entradas: 48000, saidas: 38000 },
                { mes: 'Abr', entradas: 61000, saidas: 42000 },
                { mes: 'Mai', entradas: 55000, saidas: 39000 },
                { mes: 'Jun', entradas: 67000, saidas: 45000 }
              ]} />
            </div>
          </div>
        )}
      </div>
    </div>
    </InstrumentedErrorBoundary>
  );
}