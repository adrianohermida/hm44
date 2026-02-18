import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bookmark } from 'lucide-react';
import FiltroTicketCard from './FiltroTicketCard';
import { useFiltrosTicket } from './hooks/useFiltrosTicket';

export default function FiltrosTicketSalvos({ onAplicar, onNovo }) {
  const { filtros, isLoading, favoritar, deletar } = useFiltrosTicket();

  if (isLoading) {
    return <Card><CardContent className="h-32 animate-pulse bg-gray-100" /></Card>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Filtros Salvos
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onNovo}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filtros.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
            Nenhum filtro salvo
          </p>
        ) : (
          filtros.map(filtro => (
            <FiltroTicketCard
              key={filtro.id}
              filtro={filtro}
              onAplicar={onAplicar}
              onFavoritar={() => favoritar(filtro)}
              onDeletar={deletar}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}