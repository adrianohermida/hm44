import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Mail, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function DepartamentoCard({ departamento, onEdit }) {
  const queryClient = useQueryClient();

  const updateAutoAssign = useMutation({
    mutationFn: (value) => base44.entities.Departamento.update(departamento.id, {
      auto_atribuir: value
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['departamentos']);
      toast.success('Auto-atribuição atualizada');
    }
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: departamento.cor }} />
              <h4 className="font-semibold">{departamento.nome}</h4>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-2">{departamento.descricao}</p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {departamento.email}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                SLA: {departamento.sla_padrao_horas}h
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--brand-primary)]" />
            <span className="text-sm font-medium">Auto-atribuição</span>
          </div>
          <Switch
            checked={departamento.auto_atribuir}
            onCheckedChange={(value) => updateAutoAssign.mutate(value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}