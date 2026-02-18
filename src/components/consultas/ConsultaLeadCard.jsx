import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConsultaStatus from './ConsultaStatus';
import ConsultaActions from './ConsultaActions';
import ConsultaInfo from './ConsultaInfo';
import ConsultaDetails from './ConsultaDetails';

export default function ConsultaLeadCard({ lead, onApprove, onReject, onSchedule }) {
  const parseMessage = (msg) => {
    const lines = msg?.split('\n') || [];
    const data = lines.find(l => l.startsWith('Data:'))?.replace('Data:', '').trim();
    const horario = lines.find(l => l.startsWith('Horário:'))?.replace('Horário:', '').trim();
    const motivo = lines.find(l => l.startsWith('Motivo:'))?.replace('Motivo:', '').trim();
    return { data, horario, motivo };
  };

  const { data, horario, motivo } = parseMessage(lead.mensagem);

  return (
    <Card className="hover:shadow-lg transition-shadow border-[var(--border-primary)]">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base md:text-lg text-[var(--text-primary)] truncate">
            {lead.nome}
          </CardTitle>
          <ConsultaStatus status={lead.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <ConsultaInfo email={lead.email} telefone={lead.telefone} />
        <ConsultaDetails data={data} horario={horario} motivo={motivo} />
        <ConsultaActions 
          status={lead.status}
          onApprove={() => onApprove(lead)}
          onReject={() => onReject(lead)}
          onSchedule={() => onSchedule(lead)}
        />
      </CardContent>
    </Card>
  );
}