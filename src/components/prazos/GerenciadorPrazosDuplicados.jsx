import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePrazosDuplicados } from './hooks/usePrazosDuplicados';
import DuplicadoGrupo from './DuplicadoGrupo';

export default function GerenciadorPrazosDuplicados() {
  const { duplicados, isLoading, mesclarMutation } = usePrazosDuplicados();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse h-32 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (duplicados.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-gray-500">Nenhum prazo duplicado encontrado</p>
          <Button onClick={() => navigate(createPageUrl('Prazos'))}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Prazo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Copy className="w-5 h-5" />
          Prazos Duplicados ({duplicados.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {duplicados.map((grupo, idx) => (
          <DuplicadoGrupo
            key={idx}
            grupo={grupo}
            onMesclar={mesclarMutation.mutate}
          />
        ))}
      </CardContent>
    </Card>
  );
}