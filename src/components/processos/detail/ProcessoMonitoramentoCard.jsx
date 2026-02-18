import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function ProcessoMonitoramentoCard({ processoId }) {
  const [monitorado, setMonitorado] = React.useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {monitorado ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          Monitoramento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-[var(--text-secondary)]">
          {monitorado ? 'Processo está sendo monitorado' : 'Processo não está sendo monitorado'}
        </p>
        <Button 
          variant={monitorado ? 'destructive' : 'default'} 
          size="sm" 
          className="w-full"
          onClick={() => setMonitorado(!monitorado)}
        >
          {monitorado ? 'Desativar Monitoramento' : 'Ativar Monitoramento'}
        </Button>
      </CardContent>
    </Card>
  );
}