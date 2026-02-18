import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";

export default function ComunicacaoClienteHeader({ conversa }) {
  if (!conversa) return null;

  const statusColors = {
    aberta: "bg-green-100 text-green-800",
    pausada: "bg-yellow-100 text-yellow-800",
    fechada: "bg-gray-100 text-gray-800"
  };

  return (
    <Card className="bg-[var(--bg-elevated)]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Conversa ID: {conversa.id?.substring(0, 8)}...
              </span>
            </div>
            {conversa.assunto && (
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {conversa.assunto}
              </h3>
            )}
            {conversa.descricao && (
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                {conversa.descricao}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={statusColors[conversa.status] || statusColors.aberta}>
              {conversa.status || 'aberta'}
            </Badge>
            {conversa.created_date && (
              <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                <Clock className="w-3 h-3" />
                {new Date(conversa.created_date).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}