import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function FaturaCardCliente({ honorario }) {
  const statusColors = {
    pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    parcialmente_pago: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    pago: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelado: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const parcelas = honorario.parcelas || [];
  const parcelasPendentes = parcelas.filter(p => p.status === 'pendente' || p.status === 'vencido');
  const proximoVencimento = parcelasPendentes[0]?.vencimento;

  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-[var(--text-primary)]">
            {honorario.tipo === 'contratuais' ? 'Honorários Contratuais' : 'Honorários Sucumbenciais'}
          </CardTitle>
          <Badge className={statusColors[honorario.status] || statusColors.pendente}>
            {honorario.status?.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Valor Total</span>
          </div>
          <span className="text-lg font-semibold text-[var(--text-primary)]">
            R$ {honorario.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {proximoVencimento && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4" />
            Próximo vencimento: {new Date(proximoVencimento).toLocaleDateString('pt-BR')}
          </div>
        )}

        <div className="pt-2 border-t border-[var(--border-primary)]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Parcelas pagas</span>
            <span className="font-medium text-[var(--text-primary)]">
              {parcelas.filter(p => p.status === 'pago').length} / {parcelas.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}