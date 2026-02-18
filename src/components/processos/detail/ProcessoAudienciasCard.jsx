import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AudienciaFormInline from './AudienciaFormInline';

export default function ProcessoAudienciasCard({ processoId }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: audiencias = [] } = useQuery({
    queryKey: ['audiencias-processo', processoId],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.AudienciaProcesso.filter({ 
        processo_id: processoId,
        escritorio_id: user.escritorio_id
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.AudienciaProcesso.create({
        ...data,
        escritorio_id: user.escritorio_id,
        processo_id: processoId,
        status: 'agendada'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['audiencias-processo']);
      setShowForm(false);
      toast.success('Audiência criada');
    }
  });

  const futuras = audiencias.filter(a => new Date(a.data) > new Date() && a.status !== 'realizada');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" />Audiências
          {futuras.length > 0 && <Badge>{futuras.length}</Badge>}
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showForm && <AudienciaFormInline onSave={createMutation.mutate} onCancel={() => setShowForm(false)} />}
        {futuras.slice(0, 3).map(audiencia => (
          <div key={audiencia.id} className="p-2 rounded hover:bg-[var(--bg-secondary)]">
            <p className="text-sm font-medium">{audiencia.tipo}</p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {format(new Date(audiencia.data), 'dd/MM/yyyy')} às {audiencia.hora}
            </p>
            <p className="text-xs text-[var(--text-secondary)] truncate">{audiencia.local}</p>
          </div>
        ))}
        {futuras.length === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center py-2">Nenhuma audiência agendada</p>
        )}
      </CardContent>
    </Card>
  );
}