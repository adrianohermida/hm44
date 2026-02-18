import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import EndpointTester from '../EndpointTester';
import MockServerButton from '../MockServerButton';
import AlertasList from '../AlertasList';

export default function TestePainel({ endpoint, alertas, onResult, onMockGenerated }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{endpoint.nome}</CardTitle>
            <MockServerButton 
              endpointId={endpoint.id} 
              onMockGenerated={onMockGenerated} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <EndpointTester endpoint={endpoint} onResult={onResult} />
        </CardContent>
      </Card>

      {alertas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertasList alertas={alertas.slice(0, 5)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}