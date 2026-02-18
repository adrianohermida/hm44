import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, TrendingDown, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanoCardCliente({ plano }) {
  const [expanded, setExpanded] = useState(false);
  const statusColors = {
    ativo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    concluido: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    cancelado: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const totalDividas = plano.dividas?.reduce((sum, d) => sum + (d.valor || 0), 0) || 0;

  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-[var(--text-primary)]">
            Plano de Repactuação
          </CardTitle>
          <Badge className={statusColors[plano.status] || statusColors.ativo}>
            {plano.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Total em Dívidas</span>
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              R$ {totalDividas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>Capacidade de Pagamento</span>
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              R$ {(plano.renda_disponivel || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {plano.created_date && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] pt-2 border-t border-[var(--border-primary)]">
            <Calendar className="w-4 h-4" />
            Criado em {new Date(plano.created_date).toLocaleDateString('pt-BR')}
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          <FileText className="w-4 h-4 mr-2" />
          {expanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
          {expanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
        </Button>
        {expanded && plano.dividas?.length > 0 && (
          <div className="border-t border-[var(--border-primary)] pt-3 space-y-2">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Dívidas</p>
            {plano.dividas.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-primary)] truncate flex-1">{d.credor || 'Credor'}</span>
                <span className="text-[var(--text-secondary)] ml-2 flex-shrink-0">
                  R$ {(d.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}