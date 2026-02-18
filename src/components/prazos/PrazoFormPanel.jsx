import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PrazoForm from './PrazoForm';

export default function PrazoFormPanel({ publicacao, processo, onSuccess }) {
  const [showForm, setShowForm] = useState(false);

  const { data: escritorio, isLoading } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      return escritorios[0];
    }
  });

  const handleSuccess = (prazo) => {
    setShowForm(false);
    onSuccess?.(prazo);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!escritorio) {
    return (
      <Card className="border-[var(--brand-warning)]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-[var(--brand-warning)]">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Escritório não configurado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Criar Prazo</CardTitle>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Novo
            </Button>
          )}
        </div>
      </CardHeader>
      {showForm && (
        <CardContent>
          <PrazoForm
            publicacao={publicacao}
            processo={processo}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </CardContent>
      )}
    </Card>
  );
}