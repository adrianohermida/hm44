import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function ConectorCard({ conector, onEdit }) {
  const queryClient = useQueryClient();

  const deletar = async () => {
    if (!confirm('Deletar conector?')) return;
    try {
      await base44.entities.ConectorAPI.delete(conector.id);
      queryClient.invalidateQueries(['conectores']);
      toast.success('Conector deletado');
    } catch {
      toast.error('Erro ao deletar');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{conector.nome}</CardTitle>
          <Badge variant={conector.ativo ? 'default' : 'secondary'}>
            {conector.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-tertiary)]">Tipo</span>
            <Badge variant="outline">{conector.tipo}</Badge>
          </div>
          <div>
            <span className="text-[var(--text-tertiary)]">URL</span>
            <p className="text-[var(--text-secondary)] text-xs truncate">{conector.base_url}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Edit className="w-3 h-3 mr-1" /> Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={deletar}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}