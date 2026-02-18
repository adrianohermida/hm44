import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function ROIEstimado({ artigo, visitasMensais = 100 }) {
  const [ticketMedio, setTicketMedio] = useState(5000);
  
  const calcularROI = () => {
    const taxaConversao = 0.02;
    const leadsPorMes = visitasMensais * taxaConversao;
    const taxaFechamento = 0.3;
    const clientesPorMes = leadsPorMes * taxaFechamento;
    const receitaMensal = clientesPorMes * ticketMedio;
    const receitaAnual = receitaMensal * 12;
    
    const custoPorArtigo = 500;
    const roi = ((receitaAnual - custoPorArtigo) / custoPorArtigo) * 100;
    
    return {
      leadsPorMes: Math.round(leadsPorMes),
      clientesPorMes: clientesPorMes.toFixed(1),
      receitaMensal: receitaMensal.toFixed(0),
      receitaAnual: receitaAnual.toFixed(0),
      roi: roi.toFixed(0)
    };
  };

  const metricas = calcularROI();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          ROI Estimado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs">Ticket Médio (R$)</Label>
          <Input
            type="number"
            value={ticketMedio}
            onChange={(e) => setTicketMedio(Number(e.target.value))}
            className="text-sm"
          />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between p-2 bg-blue-50 rounded">
            <span>Leads/mês estimados:</span>
            <Badge variant="outline">{metricas.leadsPorMes}</Badge>
          </div>
          <div className="flex justify-between p-2 bg-purple-50 rounded">
            <span>Clientes/mês estimados:</span>
            <Badge variant="outline">{metricas.clientesPorMes}</Badge>
          </div>
          <div className="flex justify-between p-2 bg-green-50 rounded">
            <span>Receita mensal:</span>
            <Badge className="bg-green-600">R$ {metricas.receitaMensal}</Badge>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold">ROI Anual:</span>
            </div>
            <Badge className="bg-green-600 text-lg">{metricas.roi}%</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Receita anual estimada: R$ {metricas.receitaAnual}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}