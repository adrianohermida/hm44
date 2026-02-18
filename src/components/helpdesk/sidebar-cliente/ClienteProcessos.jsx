import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import ProcessoItemButton from './ProcessoItemButton';

export default function ClienteProcessos({ processos = [], ticketId, isLoading }) {
  const navigate = useNavigate();

  const handleProcessoClick = (proc) => {
    toast.info('Abrindo processo...');
    navigate(`${createPageUrl('ProcessoDetails')}?id=${proc.id}&fromTicket=${ticketId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Processos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--text-tertiary)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (processos.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Processos</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(createPageUrl('Processos'))}
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {processos.map(proc => (
          <ProcessoItemButton
            key={proc.id}
            processo={proc}
            onClick={() => handleProcessoClick(proc)}
          />
        ))}
      </CardContent>
    </Card>
  );
}