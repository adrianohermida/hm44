import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, User, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TicketCardCliente({ ticket }) {
  const navigate = useNavigate();
  const statusColors = {
    aberto: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    triagem: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    em_atendimento: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    aguardando_cliente: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    resolvido: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    fechado: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const prioridadeColors = {
    baixa: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    media: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    alta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    urgente: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };

  return (
    <Card
      className="bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all cursor-pointer"
      onClick={() => navigate(`${createPageUrl('EnviarTicket')}?id=${ticket.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base text-[var(--text-primary)] line-clamp-2">
            {ticket.titulo}
          </CardTitle>
          <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {ticket.descricao}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={statusColors[ticket.status] || statusColors.aberto}>
            {ticket.status?.replace('_', ' ')}
          </Badge>
          {ticket.prioridade && (
            <Badge className={prioridadeColors[ticket.prioridade]}>
              {ticket.prioridade}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(ticket.created_date).toLocaleDateString('pt-BR')}
          </div>
          {ticket.responsavel_nome && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {ticket.responsavel_nome}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}