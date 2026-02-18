import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Video } from "lucide-react";

export default function AgendamentoCardCliente({ consulta }) {
  const statusColors = {
    agendada: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    confirmada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    realizada: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const isPast = new Date(consulta.data_hora) < new Date();

  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-[var(--text-primary)]">
              {consulta.tipo_consulta || 'Consulta Jurídica'}
            </h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {consulta.observacoes || 'Reunião agendada'}
            </p>
          </div>
          <Badge className={statusColors[consulta.status] || statusColors.agendada}>
            {consulta.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4" />
            {new Date(consulta.data_hora).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Clock className="w-4 h-4" />
            {new Date(consulta.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          {consulta.modalidade && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              {consulta.modalidade === 'videoconferencia' ? (
                <Video className="w-4 h-4" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {consulta.modalidade}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}