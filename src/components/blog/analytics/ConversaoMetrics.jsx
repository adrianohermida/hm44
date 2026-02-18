import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ConversaoMetrics({ visitantes, leads, consultas, clientes }) {
  const taxaLeads = visitantes > 0 ? ((leads / visitantes) * 100).toFixed(1) : 0;
  const taxaConsultas = leads > 0 ? ((consultas / leads) * 100).toFixed(1) : 0;
  const taxaClientes = consultas > 0 ? ((clientes / consultas) * 100).toFixed(1) : 0;
  const taxaGlobal = visitantes > 0 ? ((clientes / visitantes) * 100).toFixed(2) : 0;

  const metricas = [
    { label: 'Visitante → Lead', taxa: taxaLeads, ideal: 2, cor: 'blue' },
    { label: 'Lead → Consulta', taxa: taxaConsultas, ideal: 30, cor: 'purple' },
    { label: 'Consulta → Cliente', taxa: taxaClientes, ideal: 40, cor: 'green' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Taxas de Conversão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metricas.map((m, i) => {
          const performance = parseFloat(m.taxa) >= m.ideal;
          return (
            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {performance ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-xs">{m.label}</span>
              </div>
              <Badge variant={performance ? 'default' : 'outline'}>
                {m.taxa}% {!performance && `(meta: ${m.ideal}%)`}
              </Badge>
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold">Conversão Global:</span>
            <Badge className="bg-primary">{taxaGlobal}%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}