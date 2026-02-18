import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import DiagnosticoStep from '@/components/editor-plano/DiagnosticoStep';

export default function EditorPlanoDiagnostico({ planoData, clienteSelecionado }) {
  const temRendas = planoData.rendas.length > 0;
  const temDespesas = planoData.despesas.length > 0;
  const temDividas = planoData.dividas.length > 0;
  const dadosCompletos = temRendas && temDespesas && temDividas;

  if (!dadosCompletos) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diagnóstico</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-sm">
              Preencha rendas, despesas e dívidas para gerar o diagnóstico.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Diagnóstico</CardTitle>
      </CardHeader>
      <CardContent>
        <DiagnosticoStep 
          cliente={{ nome_completo: clienteSelecionado?.nome_completo }}
          rendas={planoData.rendas}
          despesas={planoData.despesas}
          dividas={planoData.dividas}
        />
      </CardContent>
    </Card>
  );
}