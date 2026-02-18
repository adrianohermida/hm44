import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RendasFormStep from '@/components/editor-plano/RendasFormStep';
import DespesasFormStep from '@/components/editor-plano/DespesasFormStep';
import DividasFormStep from '@/components/editor-plano/DividasFormStep';

export default function EditorPlanoDadosSection({ planoData, onChange }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fontes de Renda</CardTitle>
        </CardHeader>
        <CardContent>
          <RendasFormStep 
            data={planoData.rendas} 
            onChange={(d) => onChange({ ...planoData, rendas: d })} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mínimo Existencial</CardTitle>
        </CardHeader>
        <CardContent>
          <DespesasFormStep 
            data={planoData.despesas} 
            onChange={(d) => onChange({ ...planoData, despesas: d })} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dívidas</CardTitle>
        </CardHeader>
        <CardContent>
          <DividasFormStep 
            dividas={planoData.dividas}
            credores={planoData.credores}
            onDividasChange={(d) => onChange({ ...planoData, dividas: d })}
            onCredoresChange={(c) => onChange({ ...planoData, credores: c })}
          />
        </CardContent>
      </Card>
    </>
  );
}