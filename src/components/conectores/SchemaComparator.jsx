import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SchemaDiff from './SchemaDiff';

export default function SchemaComparator({ schemaAnterior, schemaNovo }) {
  if (!schemaAnterior || !schemaNovo) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação de Schemas</CardTitle>
      </CardHeader>
      <CardContent>
        <SchemaDiff anterior={schemaAnterior} novo={schemaNovo} />
      </CardContent>
    </Card>
  );
}