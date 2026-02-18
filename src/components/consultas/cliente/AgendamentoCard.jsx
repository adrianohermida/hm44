import React from 'react';
import { Calendar, Clock, MapPin, Edit2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ConsultaStatus from '../ConsultaStatus';

export default function AgendamentoCard({ agendamento, onRemarcar, onCancelar, loading }) {
  const { data_hora, local, status } = agendamento;
  const dataObj = new Date(data_hora);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const podeEditar = status === 'agendada' || status === 'confirmada';

  return (
    <Card className="hover:shadow-lg transition-shadow bg-[var(--bg-elevated)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base md:text-lg">Consulta Jurídica</CardTitle>
          <ConsultaStatus status={status === 'agendada' ? 'agendado' : status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{dataFormatada}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{horaFormatada}</span>
          </div>
          {local && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-sm text-[var(--text-secondary)]">{local}</span>
            </div>
          )}
        </div>
        {podeEditar && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onRemarcar(agendamento)}
              disabled={loading}
              className="flex-1"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Remarcar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onCancelar(agendamento)}
              disabled={loading}
              className="flex-1 text-[var(--brand-error)] border-[var(--brand-error)]"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}