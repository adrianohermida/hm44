import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const TIPO_ICONS = {
  email: Mail,
  telefone: Phone,
  reuniao: Calendar
};

export default function FollowUpCard({ followup, onEdit }) {
  const queryClient = useQueryClient();
  const Icon = TIPO_ICONS[followup.tipo] || Calendar;

  const concluirMutation = useMutation({
    mutationFn: () => base44.entities.Followup.update(followup.id, {
      status: 'concluido',
      data_realizada: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['followups']);
      toast.success('Follow-up concluído');
    }
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <Icon className="w-4 h-4 text-[var(--brand-primary)] mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{followup.titulo}</h4>
              <p className="text-xs text-gray-600 mt-1">
                {format(new Date(followup.data_agendada), "d 'de' MMM, HH:mm", { locale: ptBR })}
              </p>
              {followup.descricao && (
                <p className="text-xs text-gray-500 mt-1">{followup.descricao}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button size="sm" variant="ghost" onClick={() => onEdit(followup)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => concluirMutation.mutate()}
              disabled={concluirMutation.isPending}
            >
              <CheckCircle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}