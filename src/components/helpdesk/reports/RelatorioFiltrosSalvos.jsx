import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RelatorioFiltroCard from './RelatorioFiltroCard';

export default function RelatorioFiltrosSalvos({ onSelectFiltro, escritorioId, userEmail }) {
  const { data: filtrosSalvos = [] } = useQuery({
    queryKey: ['filtros-salvos-relatorio', userEmail],
    queryFn: () => base44.entities.FiltroSalvo.filter({ 
      user_email: userEmail,
      tipo: 'relatorio'
    })
  });

  if (filtrosSalvos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Nenhum filtro salvo</p>
          <p className="text-xs text-gray-500">Configure filtros e clique em "Salvar Filtros" para reutilizar depois</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filtros Salvos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {filtrosSalvos.map(filtro => (
          <RelatorioFiltroCard
            key={filtro.id}
            filtro={filtro}
            onSelect={() => onSelectFiltro(filtro.filtros)}
          />
        ))}
      </CardContent>
    </Card>
  );
}