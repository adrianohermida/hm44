import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import CalendarioPrazoCard from './CalendarioPrazoCard';

export default function CalendarioPrazosLista({ date, prazos }) {
  const navigate = useNavigate();

  if (!prazos || prazos.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center space-y-3">
          <p className="text-gray-500">Nenhum prazo nesta data</p>
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
        <CardTitle className="text-base">
          {format(date, 'dd/MM/yyyy')} - {prazos.length} prazo(s)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {prazos.map(prazo => (
          <CalendarioPrazoCard key={prazo.id} prazo={prazo} />
        ))}
      </CardContent>
    </Card>
  );
}