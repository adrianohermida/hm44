import React from 'react';
import FunilIntegrado from '@/components/blog/analytics/FunilIntegrado';

export default function PerformanceFunil({ escritorioId }) {
  if (!escritorioId) return null;
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Funil de Vendas</h3>
      <FunilIntegrado escritorioId={escritorioId} />
    </div>
  );
}