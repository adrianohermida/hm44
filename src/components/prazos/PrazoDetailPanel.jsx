import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import PrazoDetailHeader from './PrazoDetailHeader';
import PrazoDetailBody from './PrazoDetailBody';
import PrazoForm from './PrazoForm';

export default function PrazoDetailPanel({ prazo, onUpdate }) {
  const [editing, setEditing] = useState(false);

  if (!prazo) return null;

  const handleSuccess = (updated) => {
    setEditing(false);
    onUpdate?.(updated);
  };

  if (editing) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Editar Prazo</h3>
        </CardHeader>
        <CardContent>
          <PrazoForm
            prazo={prazo}
            onSuccess={handleSuccess}
            onCancel={() => setEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <PrazoDetailHeader 
          titulo={prazo.titulo}
          status={prazo.status}
          onEdit={() => setEditing(true)}
        />
      </CardHeader>
      <CardContent>
        <PrazoDetailBody prazo={prazo} />
      </CardContent>
    </Card>
  );
}