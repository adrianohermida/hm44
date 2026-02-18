import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

export default function ProximaConsultaCard({ clienteId, escritorioId, onRegistrar }) {
  if (!clienteId || !escritorioId || !onRegistrar) return null;

  // TODO: Implementar quando entidade Consulta existir
  const proximaConsulta = null;

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            PRÓXIMA CONSULTA
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRegistrar}
            className="h-7 w-7 p-0"
            aria-label="Agendar consulta"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" aria-hidden="true" />
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Nenhuma consulta agendada
          </p>
          <Button
            size="sm"
            onClick={onRegistrar}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agendar Consulta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}