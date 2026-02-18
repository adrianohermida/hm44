import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Target } from 'lucide-react';

export default function GapsConversao({ dados }) {
  const identificarGaps = () => {
    const gaps = [];
    
    if (dados.visitantes > 1000 && dados.leads < 20) {
      gaps.push({
        problema: 'Baixa conversão visitante → lead',
        impacto: 'crítico',
        sugestao: 'Adicionar mais CTAs e lead magnets nos artigos'
      });
    }
    
    if (dados.leads > 50 && dados.consultas < 15) {
      gaps.push({
        problema: 'Leads não convertem em consultas',
        impacto: 'alto',
        sugestao: 'Melhorar follow-up e qualificação dos leads'
      });
    }
    
    if (dados.consultas > 20 && dados.clientes < 5) {
      gaps.push({
        problema: 'Consultas não fecham',
        impacto: 'alto',
        sugestao: 'Revisar script de atendimento e proposta de valor'
      });
    }

    return gaps;
  };

  const gaps = identificarGaps();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Gaps de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {gaps.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum gap crítico identificado 🎉</p>
        ) : (
          gaps.map((gap, i) => (
            <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded">
              <div className="flex items-start gap-2 mb-2">
                <Badge variant={gap.impacto === 'crítico' ? 'destructive' : 'outline'}>
                  {gap.impacto}
                </Badge>
                <p className="text-xs font-semibold">{gap.problema}</p>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Target className="w-3 h-3 mt-0.5 text-green-600" />
                <p>{gap.sugestao}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}